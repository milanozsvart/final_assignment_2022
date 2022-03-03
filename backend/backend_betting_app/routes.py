from flask_cors import CORS
import json
import pandas as pd
from backend_betting_app import app
from flask import url_for, flash, redirect, request, jsonify
import sys
sys.path.append(
    r'C:\Users\milan\Desktop\szakdolgozat2022\backend\src')
from Players import Players
from StatsCalculator import StatsCalculator

CORS(app)


@app.route("/")



@app.route("/get_basic_player_data", methods=["POST"])
def get_basic_player_data():
    data = request.get_json(force=True)
    playerName = data['playerName']
    playerGetter = Players()
    matchesGetter = StatsCalculator(playerName)
    playerData = playerGetter.getBasicPlayerData(playerName)
    bestPerformance = matchesGetter.bestPerformance()
    playerMatchesData = matchesGetter.getBasicStatDataForPlayer()
    playerMatchesData['bestPerformance'] = bestPerformance
    fullPlayerStats = {**playerMatchesData, **playerData}
    performanceBetweenRanks = matchesGetter.performanceAgainstRank()
    fullPlayerStats['performanceBetweenRanks'] = performanceBetweenRanks
    return json.dumps(fullPlayerStats)


@app.route("/get_reached_players", methods=["POST"])
def get_reached_players():
    data = request.get_json(force=True)
    partOfPlayerName = data['partOfPlayerName'].lower()
    playerGetter = Players()
    reachedPlayers = playerGetter.getReachedPlayers(partOfPlayerName)
    return json.dumps(reachedPlayers)


@app.route("/get_matches_data", methods=["POST"])
def get_matches_data():
    data = request.get_json(force=True)
    statCalculator = StatsCalculator(data['playerName'])
    matches = statCalculator.getPlayerMatchesAgainstOpponents(
        data['opponentRanks'], data['category'])
    return jsonify(matches)
