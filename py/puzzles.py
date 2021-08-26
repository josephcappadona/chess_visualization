import urllib.request
from pathlib import Path
import bz2
from io import StringIO
import pandas as pd
import random
import requests

from chess import pgn, Move


def download_puzzles():
    puzzles_url = "https://database.lichess.org/lichess_db_puzzle.csv.bz2"
    zipped_filename = Path(puzzles_url).name
    csv_filename = Path(puzzles_url).stem

    if not Path(zipped_filename).exists():
        print('Downloading puzzles...')
        with urllib.request.urlopen(puzzles_url) as f:
            with open(zipped_filename, 'w+b') as zipped:
                zipped.write(f.read())

    if not Path(csv_filename).exists():
        print('Unzipping puzzles...')
        zipped = bz2.BZ2File(zipped_filename)
        with open(csv_filename, 'wb') as unzipped:
            unzipped.write(zipped.read())
    
    return csv_filename

def load_puzzles(csv_filename, popularity_threshold=95):
    print('Loading puzzles...')
    csv_header = "PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl"
    puzzles_df = pd.read_csv(csv_filename, names=csv_header.split(','))
    if popularity_threshold:
        puzzles_df = puzzles_df.loc[puzzles_df['Popularity'] >= popularity_threshold]
    puzzles_df.index = puzzles_df['PuzzleId']
    puzzles_df['ThemesSet'] = puzzles_df['Themes'].apply(lambda x: set(x.split(' ')))
    return puzzles_df

def get_full_pgn(game_id):
    url = f"https://lichess.org/game/export/{game_id}?evals=0&clocks=0"
    return requests.get(url).text

def extract_puzzle(df, puzzle_id, plies_backward=1):
    puzzle = df.loc[puzzle_id]
    puzzle_url = f"https://lichess.org/training/{puzzle_id}"
    game_url = puzzle['GameUrl']
    game_id = game_url.split('/')[3]
    puzzle_ply = int(game_url.split('#')[1])
    starting_ply = puzzle_ply - plies_backward
    puzzle_moves_uci = puzzle['Moves'].split(' ')[1:]
    num_puzzle_moves = len(puzzle_moves_uci)

    game_pgn = get_full_pgn(game_id)
    game = pgn.read_game(StringIO(game_pgn))

    for _ in range(starting_ply):
        game = game.next()

    mainline_iter = iter(game.mainline())
    starting_fen = game.board().fen()

    moves_to_visualize = []
    for _ in range(plies_backward):
        next_move = next(mainline_iter).san()
        moves_to_visualize.append(next_move)
        game = game.next()

    node = game.add_main_variation(Move.from_uci(puzzle_moves_uci[0]))
    for m in puzzle_moves_uci[1:]:
        node = node.add_main_variation(Move.from_uci(m))
    mainline_iter = iter(game.mainline())

    puzzle_moves = []
    for i in range(len(puzzle_moves_uci)):
        next_move = next(mainline_iter).san()
        puzzle_moves.append(next_move)
        game = game.next()

    return dict(
        puzzleID=puzzle_id,
        startingFEN=starting_fen,
        startingPly=starting_ply,
        puzzlePly=puzzle_ply,
        visualizeMoves=moves_to_visualize,
        puzzleMoves=puzzle_moves,
        gameURL=game_url,
        puzzleURL=puzzle_url
    )

def get_puzzles(
            puzzles_df,
            count=1,
            rating_range=[500,3000],
            plies_backward=1,
            themes=[],
            themesOperator='or',
            prefer_popular=True,
            exclude=[],
        ):
    min_, max_ = rating_range
    exclude = set(exclude)
    popularity_threshold = 50 if prefer_popular else 0
    themesOp = any if themesOperator == 'or' else all
    
    query_df = puzzles_df.loc[(puzzles_df['Rating'] >= min_) \
                              & (puzzles_df['Rating'] <= max_) \
                              & ~puzzles_df['PuzzleId'].isin(exclude) \
                              & (puzzles_df['Popularity'] >= popularity_threshold)]
    if themes:
        query_df = query_df.loc[puzzles_df['ThemesSet'].apply(lambda x: themesOp(theme in x for theme in themes))]

    try:                          
        random_ids = random.sample(range(query_df.shape[0]), count)
        puzzle_ids = query_df.index[random_ids].tolist()

        puzzle_dicts = [extract_puzzle(query_df, id_, plies_backward) for id_ in puzzle_ids]
        return puzzle_dicts

    except ValueError:
        return []