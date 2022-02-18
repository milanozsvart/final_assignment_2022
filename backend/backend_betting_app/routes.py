from flask import url_for, flash, redirect, request, jsonify
from backend_betting_app import app
import pandas as pd
import json
from flask_cors import CORS

CORS(app)


@app.route("/")
@app.route("/home", methods=["POST"])
def home():
    return "Hello there!"


@app.route("/get_basic_player_data", methods=["POST"])
def get_basic_player_data():
    data = request.get_json(force=True)
    playerName = data['playerName']
    df = pd.read_csv(
        r'C:\Users\milan\Desktop\szakdolgozat2022\backend\webscraper\players.csv')
    df.set_index('surName', inplace=True, drop=False)
    returnData = {"firstName": df.loc[playerName, 'firstName'],
                  "surName": playerName, "rank": df.loc[playerName, "rank"], "flag": f"https://countryflagsapi.com/png/{df.loc[playerName, 'nationality'].lower()}"}
    return json.dumps(returnData)


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
