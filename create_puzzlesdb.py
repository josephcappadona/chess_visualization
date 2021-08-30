import yaml
import mysql.connector

from py.visualize.puzzles import download_puzzles, load_puzzles


csv_filename = download_puzzles()


with open('sql_credentials.yaml', 'rt') as f:
    credentials = yaml.safe_load(f)

conn = mysql.connector.connect(**credentials)
cursor = conn.cursor()

try:
    cursor.execute("CREATE DATABASE puzzledb")
except mysql.connector.errors.DatabaseError:
    pass

cursor.execute("USE puzzledb")


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
        `PuzzleId` VARCHAR(5) PRIMARY KEY NOT NULL,
        `FEN` VARCHAR(100) NOT NULL,
        `Moves` VARCHAR(100) NOT NULL,
        `Rating` INTEGER NOT NULL,
        `Popularity` INTEGER NOT NULL,
        `ThemesSet` SET({', '.join([ f"'{t}'" for t in sorted(all_themes)])}) NOT NULL,
        `GameUrl` VARCHAR(100) NOT NULL
        );
    '''
    cursor.execute(create_table_query)

    conn.commit()

except mysql.connector.errors.ProgrammingError:
    pass


insert_query_template = '''
    INSERT INTO Puzzles (PuzzleId, FEN, Moves, Rating, Popularity, ThemesSet, GameUrl)
    VALUES ('{PuzzleId}', '{FEN}', '{Moves}', {Rating}, {Popularity}, '{ThemesString}', '{GameUrl}');
'''

with open(csv_filename, 'rt') as f:
    headers = "PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl".split(',')

    for i, line in enumerate(f.readlines()):
        if i % 100000 == 0: print(i)

        puzzle_dict = {k: v for k,v in zip(headers, line.split(','))}
        if int(puzzle_dict['Popularity']) > 90:
            query = insert_query_template.format(**puzzle_dict,
                                                 ThemesString=','.join(puzzle_dict['Themes'].split(',')))
            try:
                cursor.execute(query)
            except:
                pass

conn.commit()

cursor.close()
conn.close()
