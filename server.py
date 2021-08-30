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
from py.visualize.sql import query_puzzles
from py.visualize.utils import hash_params


with open('sql_credentials.yaml', 'rt') as f:
    credentials = yaml.safe_load(f)

conn = mysql.connector.connect(**credentials)
cursor = conn.cursor()
cursor.execute("USE puzzledb")
    

puzzle_queue = defaultdict(set)

app = Flask(__name__)

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
    eligible = puzzle_queue[params_identifier].difference(set(data['prevPuzzles']))

    if not eligible:
        print(f'Querying {params_identifier}')
        queried_puzzles = query_puzzles(cursor,
                                rating_range=data['ratingRange'],
                                themes=data['themes'],
                                themes_operator=data['themesOperator'])
        puzzle_queue[params_identifier].update(queried_puzzles)
        eligible = puzzle_queue[params_identifier].difference(set(data['prevPuzzles']))
        
    if eligible:
        puzzle_raw = eligible.pop()
        puzzle_queue[params_identifier].remove(puzzle_raw)
        puzzle = build_puzzle(*puzzle_raw, plies_backward=data['pliesBackward'])
        puzzles = [puzzle]
    else:
        puzzles = []
    
    msg = "" if puzzles else "No such puzzles"

    ret = dict(
        puzzles=puzzles,
        message=msg
    )
            
    return json.dumps(ret), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0')