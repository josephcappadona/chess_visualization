import yaml
import mysql.connector

from py.puzzles import download_puzzles, load_puzzles


csv_filename = download_puzzles()
puzzles_df = load_puzzles(csv_filename)


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
    union_set = set()
    for s in puzzles_df['ThemesSet'].to_list():
        union_set.update([f"'{x}'" for x in s])

    create_table_query = f'''
        CREATE TABLE `Puzzles` (
        `PuzzleId` VARCHAR(5) PRIMARY KEY NOT NULL,
        `FEN` VARCHAR(100) NOT NULL,
        `Moves` VARCHAR(100) NOT NULL,
        `Rating` INTEGER NOT NULL,
        `Popularity` INTEGER NOT NULL,
        `ThemesSet` SET({', '.join(sorted(union_set))}) NOT NULL,
        `GameUrl` VARCHAR(100) NOT NULL
        );
    '''
    cursor.execute(create_table_query)

    conn.commit()

except mysql.connector.errors.DatabaseError:
    pass


insert_query_template = '''
    INSERT INTO Puzzles (PuzzleId, FEN, Moves, Rating, Popularity, ThemesSet, GameUrl)
    VALUES ('{PuzzleId}', '{FEN}', '{Moves}', {Rating}, {Popularity}, '{ThemesString}', '{GameUrl}');
'''
for i in range(puzzles_df.shape[0]):

    if i % 100000 == 0: print(i)

    puzzle_dict = puzzles_df.iloc[i]
    if puzzle_dict['Popularity'] > 90:
        query = insert_query_template.format(**puzzle_dict,
                                            ThemesString=','.join(puzzle_dict['ThemesSet']))
        try:
            cursor.execute(query)
        except:
            pass
conn.commit()


cursor.close()
conn.close()