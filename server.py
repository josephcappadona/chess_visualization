import os
import json
from pprint import pprint
from pathlib import Path

from flask import Flask, render_template, request, abort, jsonify
import pandas as pd
import numpy as np

from py.puzzles import download_puzzles, load_puzzles, get_puzzles

csv_filename = download_puzzles()
puzzles_df = load_puzzles(csv_filename)


app = Flask(__name__)

app_cache = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/puzzles', methods=['POST'])
def api_analysis():
    data = request.json
    
    puzzles = get_puzzles(
        puzzles_df,
        rating_range=data['ratingRange'],
        plies_backward=data['pliesBackward'],
        themes=data['themes'],
        themesOperator=data['themesOperator'],
        exclude=data['prevPuzzles']
    )

    ret = dict(
        puzzles=puzzles
    )
            
    return json.dumps(ret), 201


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=3000,
        debug=True
    )
