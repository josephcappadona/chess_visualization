headers = ['PuzzleId', 'FEN', 'Moves', 'Rating', 'RatingDeviation', 'Popularity', 'NbPlays', 'Themes',
           'GameUrl', 'ECO', 'Opening', 'White', 'Black', 'WhiteElo', 'BlackElo', 'GameMoves', 'GameId', 'TimeControl']
pgn_headers = ['ECO', 'Opening', 'White', 'Black', 'WhiteElo', 'BlackElo', 'TimeControl']

def formatOpening(s):
    return s.replace('\'', '\\\'')
def query_puzzles(cursor,
                  rating_range=[500,3000],
                  themes=[],
                  themes_operator="or",
                  openings=[],
                  popularity_threshold=0,
                  count=100):
    
    min_rating, max_rating = rating_range

    popularity_query = f"Popularity >= {popularity_threshold}"
    rating_query = f"Rating > {min_rating} AND Rating < {max_rating}"
    themes_query = f" {themes_operator.upper()} ".join([f"FIND_IN_SET('{theme}', Themes)" for theme in themes])
    openings_query = " OR ".join([f"(ECO LIKE '{eco}' AND Opening LIKE '{formatOpening(opening)}')" for eco, opening in openings])

    where_queries = [popularity_query, rating_query]
    if themes:
        where_queries.append(f'({themes_query})')
    if openings:
        where_queries.append(f'({openings_query})')
    where_query = " AND ".join(where_queries)

    query = f'''SELECT Count(PuzzleId) FROM Puzzles WHERE ({where_query})'''
    cursor.execute(query)
    query_count = next(cursor)[0]

    # https://stackoverflow.com/a/41581041
    query = f'''SELECT * FROM Puzzles AS t1 
                JOIN (
                    SELECT PuzzleId FROM Puzzles
                    WHERE ({where_query})
                    ORDER BY RAND()
                    LIMIT {count}
                ) AS t2
                    ON t1.PuzzleId=t2.PuzzleId'''
    cursor.execute(query)
    puzzles = [list(x) for x in cursor]
    return [tuple(x[:7] + [tuple(x[7])] + x[8:]) for x in puzzles], query_count