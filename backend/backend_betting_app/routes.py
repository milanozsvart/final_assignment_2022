import sys
sys.path.append(
    r'C:\Users\milan\Desktop\szakdolgozat2022\backend\src')
from Players import Players
from StatsCalculator import StatsCalculator
import requests
from backend_betting_app.models import Match
from flask_cors import CORS
import json
import pandas as pd
from backend_betting_app import db
from backend_betting_app import app
from datetime import datetime
from flask import url_for, flash, redirect, request, jsonify



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


@app.route("/get_todays_matches_from_db", methods=["GET"])
def get_todays_matches_from_db():
    matches = Match.query.all()
    returnMatches = {}
    returnMatches["matches"] = [{"id": match.id, "date": match.date, "tier": match.tier, "round": match.round, "firstPlayer": match.firstPlayer,
                                 "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds} for match in matches]
    return jsonify(returnMatches)


@app.route("/get_todays_matches_from_api", methods=["GET"])
def get_todays_matches_from_api():
    url = "https://tennis-live-data.p.rapidapi.com/matches-by-date/2022-03-11"

    headers = {
        'x-rapidapi-host': "tennis-live-data.p.rapidapi.com",
        'x-rapidapi-key': "53d34c6facmsh98fd17e0f5dbbe4p15651ajsnd6a53a13558a"
    }
    response = requests.request("GET", url, headers=headers)
    with open("todayMatches.json", "a+") as f:
        f.write(response.text)

    with open('todayMatches.json') as json_file:
        dictionary = json.load(json_file)

    matches = []

    del dictionary['meta']

    for result in dictionary["results"]:
        if result["tournament"]["code"] != "WTA":
            dictionary["results"].remove(result)

    for result in dictionary["results"]:
        for match in result["matches"]:
            matches.append({"date": match["date"], "firstPlayer": match["home_player"],
                            "secondPlayer": match["away_player"], "round": match["round_name"]})
            db.session.add(Match(date=datetime.utcnow(
            ), round=match["round_name"], tier="W1000", firstPlayer=match["home_player"], secondPlayer=match["away_player"], firstOdds=1.2, secondOdds=2.1))
    db.session.commit()
    print(Match.query.all())
    return response


@app.route("/get_todays_odds", methods=["POST"])
def get_today_odds():
    url = "https://betsapi2.p.rapidapi.com/v1/bet365/upcoming"

    querystring = {"sport_id": "13", "league_id": "10071612", "page": "1"}

    headers = {
        'x-rapidapi-host': "betsapi2.p.rapidapi.com",
        'x-rapidapi-key': "53d34c6facmsh98fd17e0f5dbbe4p15651ajsnd6a53a13558a"
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    with open("todaysOdds.txt", "a+") as f:
        f.write(response.text)
    print(response.text)
    return response
