
def query_puzzles(cursor,
                  rating_range=[500,3000],
                  themes=[],
                  themes_operator="or",
                  popularity_threshold=0,
                  count=100):
    
    min_rating, max_rating = rating_range

    popularity_query = f"Popularity >= {popularity_threshold}"
    rating_query = f"Rating > {min_rating} AND Rating < {max_rating}"
    themes_query = f" {themes_operator.upper()} ".join([f"FIND_IN_SET('{theme}', ThemesSet)" for theme in themes])

    where_queries = [popularity_query, rating_query]
    if themes:
        where_queries.append(themes_query)
    where_query = " AND ".join(where_queries)

    # https://stackoverflow.com/a/41581041
    query = f'''SELECT t1.PuzzleId, Moves, Rating, GameUrl FROM Puzzles AS t1 
                JOIN (
                    SELECT PuzzleId FROM Puzzles
                    WHERE {where_query}
                    ORDER BY -LOG(1-RAND())/Popularity
                    LIMIT {count}
                ) AS t2
                    ON t1.PuzzleId=t2.PuzzleId'''
    cursor.execute(query)
    return [x for x in cursor]