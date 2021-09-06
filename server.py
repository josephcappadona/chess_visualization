import os
import json
from pprint import pprint
from pathlib import Path
from collections import defaultdict

import mysql.connector
import yaml
from flask import Flask, render_template, request, abort, jsonify
import pandas as pd
import numpy as np

from py.visualize.puzzles import build_puzzle
from py.visualize.sql import query_puzzles, headers
from py.visualize.utils import hash_params


with open('sql_credentials.yaml', 'rt') as f:
    credentials = yaml.safe_load(f)

conn = mysql.connector.connect(**credentials)
cursor = conn.cursor()
cursor.execute("USE puzzledb")
    

puzzle_queue = defaultdict(set)
query_counts = {}

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/visualize')
def visualize():
    return render_template('visualize.html')

@app.route('/api/puzzles', methods=['POST'])
def api_visualize():
    data = json.loads(request.json) if isinstance(request.json, str) else request.json

    params_identifier = hash_params(data)
    eligible = puzzle_queue[params_identifier].difference(set(data['prevPuzzles']))

    if not eligible:
        print(f'Querying {params_identifier}')
        queried_puzzles, query_count = query_puzzles(cursor,
                                                     rating_range=data['ratingRange'],
                                                     themes=data['themes'],
                                                     themes_operator=data['themesOperator'],
                                                     openings=data['openings'])
        puzzle_queue[params_identifier].update(queried_puzzles)
        query_counts[params_identifier] = query_count
        eligible = puzzle_queue[params_identifier].difference(set(data['prevPuzzles']))
        
    if eligible:
        puzzle_raw = eligible.pop()
        puzzle_queue[params_identifier].remove(puzzle_raw)
        puzzle_dict = {k:v for k,v in zip(headers, puzzle_raw)}
        puzzle = build_puzzle(puzzle_dict, plies_backward=data['pliesBackward'])
        puzzles = [puzzle]
        pprint(puzzle)
    else:
        puzzles = []
    
    msg = f"{query_counts[params_identifier]} such puzzles" if puzzles else "No such puzzles"

    ret = dict(
        puzzles=puzzles,
        message=msg
    )
            
    return json.dumps(ret), 201


if __name__ == '__main__':

    with open('ssl_paths.yaml', 'rt') as f:
        ssl_paths = yaml.safe_load(f)
    ssl_context = (ssl_paths['cert'], ssl_paths['key'])

    app.run(
        host='0.0.0.0',
        ssl_context=ssl_context
    )
