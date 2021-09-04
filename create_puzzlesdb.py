import yaml
import mysql.connector
import requests
import chess
import chess.pgn
from io import StringIO 
from time import sleep

from py.visualize.puzzles import download_puzzles, load_puzzles
from py.visualize.sql import headers, pgn_headers


with open('sql_credentials.yaml', 'rt') as f:
    credentials = yaml.safe_load(f)

conn = mysql.connector.connect(**credentials)
cursor = conn.cursor()

try:
    cursor.execute("CREATE DATABASE puzzledb")
except mysql.connector.errors.DatabaseError:
    pass

cursor.execute("USE puzzledb")

csv_filename = download_puzzles()

try:
    
    all_themes = ['advancedPawn','advantage','anastasiaMate','arabianMate','attackingF2F7',
                  'attraction','backRankMate','bishopEndgame','bodenMate','capturingDefender',
                  'castling','clearance','crushing','defensiveMove','deflection','discoveredAttack',
                  'doubleBishopMate','doubleCheck','dovetailMate','enPassant','endgame','equality',
                  'exposedKing','fork','hangingPiece','hookMate','interference','intermezzo',
                  'kingsideAttack','knightEndgame','long','master','masterVsMaster','mate','mateIn1',
                  'mateIn2','mateIn3','mateIn4','mateIn5','middlegame','oneMove','opening','pawnEndgame',
                  'pin','promotion','queenEndgame','queenRookEndgame','queensideAttack','quietMove',
                  'rookEndgame','sacrifice','short','skewer','smotheredMate','superGM','trappedPiece',
                  'underPromotion','veryLong','xRayAttack','zugzwang']

    create_table_query = f'''
        CREATE TABLE `Puzzles` (
        `PuzzleId` VARCHAR(5) BINARY PRIMARY KEY NOT NULL,
        `FEN` VARCHAR(100) NOT NULL,
        `Moves` VARCHAR(300) NOT NULL,
        `Rating` INTEGER NOT NULL,
        `RatingDeviation` INTEGER NOT NULL,
        `NbPlays` INTEGER NOT NULL,
        `Popularity` INTEGER NOT NULL,
        `Themes` SET({', '.join([ f"'{t}'" for t in sorted(all_themes)])}) NOT NULL,
        `GameUrl` VARCHAR(100) NOT NULL,
        `ECO` VARCHAR(3) NOT NULL,
        `Opening` VARCHAR(100) NOT NULL,
        `White` VARCHAR(30) NOT NULL,
        `Black` VARCHAR(30) NOT NULL,
        `WhiteElo` INTEGER NOT NULL,
        `BlackElo` INTEGER NOT NULL,
        `GameMoves` VARCHAR(3000) NOT NULL,
        `GameId` VARCHAR(10) NOT NULL,
        `TimeControl` VARCHAR(10) NOT NULL
        );
    '''
    cursor.execute(create_table_query)

    conn.commit()

except mysql.connector.errors.ProgrammingError:
    pass


cursor.execute('SELECT PuzzleId FROM Puzzles')
preloaded_puzzleIDs = set([x[0] for x in cursor])
print(f'{len(preloaded_puzzleIDs)} puzzles already in Puzzles table')

insert_query_template = '''
    INSERT INTO Puzzles ({headers_str})
    VALUES ('{PuzzleId}', '{FEN}', '{Moves}', {Rating}, {RatingDeviation}, {Popularity}, {NbPlays}, '{Themes}',
            '{GameUrl}', '{ECO}', '{Opening}', '{White}', '{Black}', {WhiteElo}, {BlackElo}, '{GameMoves}', '{GameId}', '{TimeControl}');
'''
lichess_pgn_url = 'https://lichess.org/games/export/_ids?opening=true'

def insert_puzzles(puzzle_dicts):
    sleep(3)
    print('requesting...')
    try:
        res = requests.post(lichess_pgn_url,
                            data=','.join([d['GameId'] for d in puzzle_dicts]),
                            timeout=15)
        if res.status_code == 429:
            return False
    except:
        return False
    game_pgns = res.text.split('\n\n\n')[:-1]
    puzzle_dict_map = {pd['GameId']: pd for pd in puzzle_dicts}

    print('inserting...')
    for game_pgn in game_pgns:
        game = chess.pgn.read_game(StringIO(game_pgn))
        game_id = game.headers['Site'].split('/')[-1]
        puzzle_dict = puzzle_dict_map[game_id]

        puzzle_dict['GameMoves'] = game_pgn.split('\n\n')[1]
        puzzle_dict.update({k:game.headers[k] for k in pgn_headers})
        puzzle_dict['Opening'] = puzzle_dict['Opening'].replace("'", "\\'")
        puzzle_dict['WhiteElo'] = 1500 if puzzle_dict['WhiteElo'] == "?" else puzzle_dict['WhiteElo']
        puzzle_dict['BlackElo'] = 1500 if puzzle_dict['BlackElo'] == "?" else puzzle_dict['BlackElo']
        
        query = insert_query_template.format(**puzzle_dict, headers_str=', '.join(headers))
        try:
            cursor.execute(query)
        except Exception as e:
            print(e, query)
    conn.commit()
    return True

with open(csv_filename, 'rt') as f:
    puzzle_queue = []
    for i, line in enumerate(f.readlines()):
        if i % 100000 == 0: print(i)

        puzzle_dict = {k: v for k,v in zip(headers[:9], line.split(','))}
        if int(puzzle_dict['Popularity']) > 90 \
                and puzzle_dict['PuzzleId'] not in preloaded_puzzleIDs:
            puzzle_dict['GameId'] = puzzle_dict['GameUrl'].split('/')[3].split('#')[0]
            puzzle_dict['Themes'] = puzzle_dict['Themes'].replace(' ', ',')
            puzzle_queue.append(puzzle_dict)
        
        if len(puzzle_queue) == 300:
            print(">>>>", i)
            while not (done := insert_puzzles(puzzle_queue)):
                print('sleeping...')
                sleep(60)
            puzzle_queue.clear()
            
    if puzzle_queue:
        insert_puzzles(puzzle_queue)
            
conn.commit()

cursor.close()
conn.close()
