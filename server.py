import os
import json
from pprint import pprint
from pathlib import Path
from collections import defaultdict
import random

import mysql.connector
import yaml
from flask import Flask, render_template, request, abort, jsonify
import pandas as pd
import numpy as np

from py.state import get_shared_state
from py.visualize.puzzles import build_puzzle
from py.visualize.sql import query_puzzles, headers
from py.visualize.utils import hash_params

def connect():
    with open('sql_credentials.yaml', 'rt') as f:
        credentials = yaml.safe_load(f)

    conn = mysql.connector.connect(**credentials)
    cursor = conn.cursor()
    cursor.execute("USE puzzledb")
    return conn, cursor
conn, cursor = connect_sql()


shared_dict, shared_lock = get_shared_state('127.0.0.1', 35791, b"secret")

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/visualize')
def visualize():
    return render_template('visualize.html')

@app.route('/api/puzzles', methods=['POST'])
def api_visualize():
    
    data = request.json
    params_identifier = hash_params(data)

    if params_identifier not in shared_dict:
        with shared_lock:
            shared_dict[params_identifier] = dict(puzzles=[], query_count=0)

    if not shared_dict[params_identifier]['puzzles']:
        if not conn.is_connected():
            conn, cursor = connect_sql()

        print(f'Querying {params_identifier}')
        queried_puzzles, query_count = query_puzzles(cursor,
                                                     rating_range=data['ratingRange'],
                                                     themes=data['themes'],
                                                     themes_operator=data['themesOperator'],
                                                     openings=data['openings'])
        with shared_lock:
            shared_dict[params_identifier] = dict(
                puzzles=queried_puzzles,
                query_count=query_count
            )

    eligible = shared_dict[params_identifier]['puzzles']
    query_count = shared_dict[params_identifier]['query_count']
    if eligible:
        with shared_lock:
            puzzle_raw = eligible.pop(random.randint(0, len(eligible)-1))
        puzzle_dict = {k:v for k,v in zip(headers, puzzle_raw)}
        puzzle = build_puzzle(puzzle_dict, plies_backward=data['pliesBackward'])
        puzzles = [puzzle]
        pprint(puzzle)
    else:
        puzzles = []
    
    msg = f"{query_count} such puzzles" if puzzles else "No such puzzles"

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
