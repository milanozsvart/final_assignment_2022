from flask_cors import CORS
import json
import pandas as pd
from backend_betting_app import app
from flask import url_for, flash, redirect, request, jsonify
import sys
sys.path.append(
    r'C:\Users\milan\Desktop\szakdolgozat2022\backend\src')
from Players import Players

CORS(app)


@app.route("/")
@app.route("/home", methods=["POST"])
def home():
    return "Hello there!"


@app.route("/get_basic_player_data", methods=["POST"])
def get_basic_player_data():
    data = request.get_json(force=True)
    playerName = data['playerName']
    playerGetter = Players()
    playerData = playerGetter.getBasicPlayerData(playerName)
    return json.dumps(playerData)


@app.route("/get_reached_players", methods=["POST"])
def get_reached_players():
    data = request.get_json(force=True)
    partOfPlayerName = data['partOfPlayerName'].lower()
    namesWithPart = {'values': []}
    if len(partOfPlayerName) < 1:
        return json.dumps(namesWithPart)
    df = pd.read_csv(
        r'C:\Users\milan\Desktop\szakdolgozat2022\backend\webscraper\players.csv')
    df.set_index('surName', inplace=True, drop=False)
    for index in df.index:
        if partOfPlayerName in str(index).lower():
            namesWithPart['values'].append(str(index))
        if len(namesWithPart['values']) > 2:
            return json.dumps(namesWithPart)
    return json.dumps(namesWithPart)
