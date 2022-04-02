from Tournaments import Tournaments
from backend_betting_app.models import Match, User, Dates, Bet, BetEvent
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
from datetime import date, time, datetime
import unidecode
import os
import jwt
from time import sleep
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


@app.route("/get_todays_matches_from_db/<dateToCheck>", methods=["GET"])
def get_todays_matches_from_db(dateToCheck):
    db.create_all()
    print(dateToCheck)
    dateToCheck = datetime.strptime(dateToCheck, "%Y-%m-%d").date()
    print(Dates.query.all())
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
            matches = Match.query.filter_by(date=dateToCheck)
            returnMatches["matches"] = [{"id": match.id, "result": match.result, "date": match.time.isoformat()[:5], "tier": match.tier, "round": match.round, "firstPlayer": match.firstPlayer,
                                         "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds, "pred": ResultsPredictor(unidecode.unidecode(match.firstPlayer.split(" ")[0]), unidecode.unidecode(match.secondPlayer.split(" ")[0]), p.getBasicPlayerData(
                                             unidecode.unidecode(match.firstPlayer.split(" ")[0]))["rank"], p.getBasicPlayerData(unidecode.unidecode(match.secondPlayer.split(" ")[0]))["rank"]).analysePlayerMatchesData() if p.playerInDf(unidecode.unidecode(match.firstPlayer.split(" ")[0])) and p.playerInDf(unidecode.unidecode(match.secondPlayer.split(" ")[0])) else {"player": "Not known", "points": 0}} for match in matches]
        dateInDb.checked = True
        db.session.commit()
    else:
        get_todays_matches_from_api(dateToCheck)
        exists = db.session.query(db.exists().where(
            Match.date == dateToCheck)).scalar()
        if exists:
            matches = Match.query.filter_by(date=dateToCheck)
            returnMatches["matches"] = [{"id": match.id, "date": match.time.isoformat()[:5], "tier": match.tier, "round": match.round, "firstPlayer": match.firstPlayer,
                                         "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds} for match in matches]
        dateInDb.checked = True
        db.session.commit()
        get_today_odds()

    return jsonify(returnMatches)


@app.route("/get_todays_matches_from_api/<dateToCheck>", methods=["GET"])
def get_todays_matches_from_api(dateToCheck):
    url = f"https://tennis-live-data.p.rapidapi.com/matches-by-date/{dateToCheck}"

    headers = {
        'x-rapidapi-host': "tennis-live-data.p.rapidapi.com",
        'x-rapidapi-key': os.environ.get('API_KEY')
    }
    response = requests.request("GET", url, headers=headers)
    dictionary = response.json()
    db.create_all()
    t = Tournaments()
    del dictionary['meta']
    for result in dictionary["results"]:
        if result["tournament"]["code"] != "WTA":
            dictionary["results"].remove(result)
    if str(dateToCheck) == date.today().isoformat():
        for result in dictionary["results"]:
            tournamentName = "Miami Open"
            for match in result["matches"]:
                if "Qualification" not in match["round_name"]:
                    db.session.add(Match(date=date(int(match["date"][:4]), int(match["date"][5:7]), int(match["date"][8:10])), time=time(int(match["date"][11:13]), int(match["date"][14:16])), round=match["round_name"], tier=t.getTierForTournament(tournamentName),
                                         firstPlayer=match["home_player"], secondPlayer=match["away_player"], firstOdds=1.2, secondOdds=2.1))
    else:
        for result in dictionary["results"]:
            for match in result["matches"]:
                matchToCheck = Match.query.filter_by(
                    firstPlayer=match["home_player"], secondPlayer=match["away_player"]).first()
                if match["home_id"] == match["result"]["winner_id"]:
                    matchToCheck.result = match["home_player"]
                else:
                    matchToCheck.result = match["away_player"]
    db.session.commit()
    return "asd"


@app.route("/get_todays_odds", methods=["GET"])
def get_today_odds():
    url = "https://unibet.p.rapidapi.com/competitions-by-sport"

    querystring = {"sport": "tennis"}

    headers = {
        "X-RapidAPI-Host": "unibet.p.rapidapi.com",
        "X-RapidAPI-Key": os.environ.get('API_KEY')
    }

    response = requests.request(
        "GET", url, headers=headers, params=querystring)

    tournaments = response.json()
    womensTournaments = [t["id"]
                         for t in tournaments if "tennis/wta/" in t["id"]]
    sleep(1.5)
    for wt in womensTournaments:
        url = "https://unibet.p.rapidapi.com/matches-by-competition"

        querystring = {"competitionid": wt}

        response = requests.request(
            "GET", url, headers=headers, params=querystring)
        matches = response.json()
        sleep(2)

        for m in matches:
            player1Name = transformName(m['team1']['name'])
            player2Name = transformName(m['team2']['name'])
            match = Match.query.filter_by(
                firstPlayer=player1Name, secondPlayer=player2Name).first()
            if match:
                match.firstOdds = m['odds']['1']
                match.secondOdds = m['odds']['2']
                db.session.commit()
    #print(response.text)
    return


def transformName(playerName):
    return playerName.split(",")[0] + " " + playerName.split(",")[1][1] + "."

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
            {'user': data['email']}, os.environ.get('JWT_SECRET_KEY'), algorithm="HS256")
        return {"successful": True, "token": token}
    elif not user:
        return {"message": f"There is no account registered with this email address: {data['email']}", "successful": False}
    elif user and not bcrypt.check_password_hash(user.password, data["password"]):
        return {"message": f"Wrong password, please try again!", "successful": False}


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
        data["token"], os.environ.get('JWT_SECRET_KEY'), algorithms=["HS256"])["user"]
    user = User.query.filter_by(email=userEmail).first()
    if user and bcrypt.check_password_hash(user.password, data["currentPassword"]):
        user.password = bcrypt.generate_password_hash(
            data["newPassword"]).decode('utf-8')
        db.session.commit()
        return {"successful": True}
    if not bcrypt.check_password_hash(user.password, data["currentPassword"]):
        return {"message": "This is not your current password, please try again!", "successful": False}


@app.route("/get_historic_ranks_data", methods=["POST"])
def get_historic_ranks_data():
    data = request.get_json(force=True)
    data["additionalProps"]["court"] = 'all'
    data["additionalProps"]["tournament"] = 'All'
    data["additionalProps"]["round"] = 'All'
    s = StatsCalculator(data["playerName"], data["additionalProps"])
    return s.getHistoricRanksForPlayer()


@app.route("/add_bet_to_user", methods=["POST"])
def add_bet_to_user():
    data = request.get_json(force=True)
    db.create_all()
    userEmail = jwt.decode(
        data["token"], os.environ.get('JWT_SECRET_KEY'), algorithms=["HS256"])["user"]
    user = User.query.filter_by(email=userEmail).first()
    bets = data["bets"]
    userBet = Bet(user_id=user.id)
    db.session.add(userBet)
    db.session.commit()
    for bet in bets:
        betEvent = BetEvent(
            matchId=bet["id"], bettedOn=bet["pred"]["player"], betId=userBet.id)
        db.session.add(betEvent)
    db.session.commit()
    print(BetEvent.query.all())
    return "a"


@app.route("/get_users_bets", methods=["POST"])
def get_users_bets():
    #data = request.get_json(force=True)
    #userEmail = jwt.decode(
    #    data["token"], os.environ.get('JWT_SECRET_KEY'), algorithms=["HS256"])["user"]
    userEmail = "admin@admin.com"
    user = User.query.filter_by(email=userEmail).first()
    for bet in user.bets:
        for e in bet.betEvents:
            print(e.date)
    return "a"


@app.route("/delete_users_bets", methods=["POST"])
def delete_users_bets():
    pass
