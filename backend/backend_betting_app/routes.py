from Tournaments import Tournaments
from backend_betting_app.models import Match, User, Dates
from Players import Players
from flask_cors import CORS
import json
import pandas as pd
from backend_betting_app import db
from backend_betting_app import app
from backend_betting_app import bcrypt
from StatsCalculator import StatsCalculator
from ResultsPredictor import ResultsPredictor
import requests
from datetime import date, time
import unidecode
import os
import jwt
from flask import url_for, flash, redirect, request, jsonify


CORS(app)


@app.route("/")
def home():
    pass


@app.route("/get_basic_player_data", methods=["POST"])
def get_basic_player_data():
    data = request.get_json(force=True)
    playerName = data['playerName']
    additionalProps = data['additionalProps']
    stats = {}
    if isinstance(playerName, list):
        players = playerName
        i = 0
        playerStat = Players()
        predictor = ResultsPredictor(players[0], players[1], playerStat.getBasicPlayerData(
            players[0])["rank"], playerStat.getBasicPlayerData(players[1])["rank"])
        prediction = predictor.analysePlayerMatchesData()
        for player in players:
            playerGetter = Players()
            matchesGetter = StatsCalculator(
                player, additionalProps)
            playerData = playerGetter.getBasicPlayerData(player)
            bestPerformance = matchesGetter.bestPerformance()
            playerMatchesData = matchesGetter.getBasicStatDataForPlayer()
            playerMatchesData['bestPerformance'] = bestPerformance
            fullPlayerStats = {**playerMatchesData, **playerData}
            otherPlayer = players[(i+1) % 2]
            opponentsRank = playerGetter.getBasicPlayerData(otherPlayer)[
                "rank"]
            matchesGetter.startingRanks = [max(1, int(opponentsRank) - 8)]
            matchesGetter.endingRanks = [min(1000, int(opponentsRank) + 10)]
            performanceBetweenRanks = matchesGetter.performanceAgainstRank()
            fullPlayerStats['performanceBetweenRanks'] = performanceBetweenRanks
            stats[i] = fullPlayerStats
            stats["pred"] = prediction
            i = i+1
    else:
        playerGetter = Players()
        matchesGetter = StatsCalculator(
            playerName, additionalProps)
        playerData = playerGetter.getBasicPlayerData(playerName)
        bestPerformance = matchesGetter.bestPerformance()
        playerMatchesData = matchesGetter.getBasicStatDataForPlayer()
        playerMatchesData['bestPerformance'] = bestPerformance
        stats = {**playerMatchesData, **playerData}
        performanceBetweenRanks = matchesGetter.performanceAgainstRank()
        stats['performanceBetweenRanks'] = performanceBetweenRanks
    return json.dumps(stats)


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
    statCalculator = StatsCalculator(
        data['playerName'], data["additionalProps"])
    matches = statCalculator.getPlayerMatchesAgainstOpponents(
        data['opponentRanks'], data['category'])
    return jsonify(matches)


@app.route("/get_todays_matches_from_db", methods=["GET"])
def get_todays_matches_from_db():
    db.create_all()
    dateToCheck = date.today()
    returnMatches = {"matches": []}
    dateExists = db.session.query(db.exists().where(
        Dates.date == dateToCheck)).scalar()
    if not dateExists:
        db.session.add(Dates(date=dateToCheck))
        db.session.commit()
    dateInDb = Dates.query.filter_by(date=dateToCheck).first()
    dateChecked = dateInDb.checked
    if dateChecked:
        exists = db.session.query(db.exists().where(
            Match.date == dateToCheck)).scalar()
        if exists:
            p = Players()
            matches = matches = Match.query.filter_by(date=dateToCheck)
            returnMatches["matches"] = [{"id": match.id, "date": match.time.isoformat()[:5], "tier": match.tier, "round": match.round, "firstPlayer": match.firstPlayer,
                                         "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds, "pred": ResultsPredictor(unidecode.unidecode(match.firstPlayer.split(" ")[0]), unidecode.unidecode(match.secondPlayer.split(" ")[0]), p.getBasicPlayerData(
                                             unidecode.unidecode(match.firstPlayer.split(" ")[0]))["rank"], p.getBasicPlayerData(unidecode.unidecode(match.secondPlayer.split(" ")[0]))["rank"]).analysePlayerMatchesData() if p.playerInDf(unidecode.unidecode(match.firstPlayer.split(" ")[0])) and p.playerInDf(unidecode.unidecode(match.secondPlayer.split(" ")[0])) else {"player": "Not known", "points": 0}} for match in matches]
        dateInDb.checked = True
    else:
        get_todays_matches_from_api()
        exists = db.session.query(db.exists().where(
            Match.date == dateToCheck)).scalar()
        if exists:
            matches = matches = Match.query.filter_by(date=dateToCheck)
            returnMatches["matches"] = [{"id": match.id, "date": match.time.isoformat()[:5], "tier": match.tier, "round": match.round, "firstPlayer": match.firstPlayer,
                                         "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds} for match in matches]
        dateInDb.checked = True
    db.session.commit()

    return jsonify(returnMatches)


@app.route("/get_todays_matches_from_api", methods=["GET"])
def get_todays_matches_from_api():
    dateToday = date.today().isoformat()
    url = f"https://tennis-live-data.p.rapidapi.com/matches-by-date/{dateToday}"

    headers = {
        'x-rapidapi-host': "tennis-live-data.p.rapidapi.com",
        'x-rapidapi-key': "53d34c6facmsh98fd17e0f5dbbe4p15651ajsnd6a53a13558a"
    }
    response = requests.request("GET", url, headers=headers)
    with open("todayMatches1.json", "a+") as f:
        f.write(response.text)

    with open('todayMatches1.json') as json_file:
        dictionary = json.load(json_file)

    os.remove(
        'C:\\Users\\milan\\Desktop\\szakdolgozat2022\\backend\\todayMatches1.json')

    db.create_all()

    t = Tournaments()

    del dictionary['meta']

    for result in dictionary["results"]:
        if result["tournament"]["code"] != "WTA":
            dictionary["results"].remove(result)

    for result in dictionary["results"]:
        tournamentName = result["tournament"]["name"]
        for match in result["matches"]:
            db.session.add(Match(date=date(int(match["date"][:4]), int(match["date"][5:7]), int(match["date"][8:10])), time=time(int(match["date"][11:13]), int(match["date"][14:16])), round=match["round_name"], tier=t.getTierForTournament(tournamentName),
                           firstPlayer=match["home_player"], secondPlayer=match["away_player"], firstOdds=1.2, secondOdds=2.1))
    db.session.commit()
    # print(Match.query.all())
    return "asd"


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


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True)
    hashedPassword = bcrypt.generate_password_hash(
        data["password"]).decode('utf-8')
    db.create_all()
    exists = db.session.query(db.exists().where(
        User.email == data["email"])).scalar()
    if not exists:
        db.session.add(User(email=data["email"], password=hashedPassword))
        db.session.commit()
        return {"message": f"Account created for {data['email']}", "successful": True}
    else:
        return {"message": f"There is already an account registered with this email address: {data['email']}", "successful": False}


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    user = User.query.filter_by(email=data["email"]).first()
    if user and bcrypt.check_password_hash(user.password, data["password"]):
        token = jwt.encode(
            {'user': data['email']}, 'ASDWQ3412LOUZT98cvT6Xy?.)Opewqrt6%6', algorithm="HS256")
        return {"message": f"Account created for {data['email']}", "successful": True, "token": token}
    else:
        return {"message": f"There is already an account registered with this email address: {data['email']}", "successful": False}


@app.route("/get_predictions_for_match", methods=["POST"])
def get_predictions_for_match():
    data = request.get_json(force=True)
    r = ResultsPredictor(data['player1'], data['player2'],
                         data["player1Rank"], data["player2Rank"])
    r.transformDataFrame()
    return "d"


@app.route("/change_password", methods=["POST"])
def change_password():
    data = request.get_json(force=True)
    userEmail = jwt.decode(
        data["token"], "ASDWQ3412LOUZT98cvT6Xy?.)Opewqrt6%6", algorithms=["HS256"])["user"]
    print(userEmail)
    if not userEmail:
        return {"successful": False}
    user = User.query.filter_by(email=userEmail).first()
    if user and bcrypt.check_password_hash(user.password, data["currentPassword"]):
        user.password = bcrypt.generate_password_hash(
            data["newPassword"]).decode('utf-8')
        db.session.commit()
        return {"successful": True}


@app.route("/get_historic_ranks_data", methods=["POST"])
def get_historic_ranks_data():
    data = request.get_json(force=True)
    data["additionalProps"]["court"] = 'all'
    data["additionalProps"]["tournament"] = 'All'
    data["additionalProps"]["round"] = 'All'
    s = StatsCalculator(data["playerName"], data["additionalProps"])
    return s.getHistoricRanksForPlayer()
