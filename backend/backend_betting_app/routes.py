from Tournaments import Tournaments
from backend_betting_app.models import User, Dates, Match, BetEvent, Bet
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
from datetime import date, time, datetime, timedelta
import unidecode
import os
import jwt
from time import sleep
from flask import url_for, flash, redirect, request, jsonify


CORS(app)


API_CHECKS = {
    "odds": {
        "lastChecked": None,
        "checkHours": 3
    },
    "matches": {
        "lastChecked": None,
        "checkHours": 6
    }
}





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
        prediction = predictor.finalPrediction()
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
            matchesGetter.startingRanks = [
                max(1, int(float(opponentsRank)) - 8)]
            matchesGetter.endingRanks = [
                min(1000, int(float(opponentsRank)) + 10)]
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
    dateToCheck = datetime.strptime(dateToCheck, "%Y-%m-%d").date()
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
            if str(dateToCheck) != date.today().isoformat():
                if not dateInDb.resultChecked:
                    get_todays_matches_from_api(dateToCheck)
                    dateInDb.resultChecked = True
                p = Players()
                matches = Match.query.filter_by(date=dateToCheck)
                returnMatches["matches"] = [{"id": match.id, "result": match.result, "date": match.time.isoformat()[:5], "tier": match.tier, "round": match.round, "firstPlayer": match.firstPlayer,
                                            "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds, "pred": ResultsPredictor(unidecode.unidecode(match.firstPlayer.split(" ")[0]), unidecode.unidecode(match.secondPlayer.split(" ")[0]), p.getBasicPlayerData(
                                                unidecode.unidecode(match.firstPlayer.split(" ")[0]))["rank"], p.getBasicPlayerData(unidecode.unidecode(match.secondPlayer.split(" ")[0]))["rank"]).finalPrediction() if p.playerInDf(unidecode.unidecode(match.firstPlayer.split(" ")[0])) and p.playerInDf(unidecode.unidecode(match.secondPlayer.split(" ")[0])) else {"player": "Not known", "points": 0}} for match in matches]
            else:
                matches = Match.query.filter_by(date=dateToCheck)
                p = Players()
                returnMatches["matches"] = [{"id": match.id, "date": match.time.isoformat()[:5], "tier": match.tier, "round": match.round, "firstPlayer": match.firstPlayer,
                                             "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds, "pred": ResultsPredictor(unidecode.unidecode(match.firstPlayer.split(" ")[0]), unidecode.unidecode(match.secondPlayer.split(" ")[0]), p.getBasicPlayerData(
                                                 unidecode.unidecode(match.firstPlayer.split(" ")[0]))["rank"], p.getBasicPlayerData(unidecode.unidecode(match.secondPlayer.split(" ")[0]))["rank"]).finalPrediction() if p.playerInDf(unidecode.unidecode(match.firstPlayer.split(" ")[0])) and p.playerInDf(unidecode.unidecode(match.secondPlayer.split(" ")[0])) else {"player": "Not known", "points": 0}} for match in matches]

        dateInDb.checked = True
        db.session.commit()
    else:
        get_todays_matches_from_api(dateToCheck)
        exists = db.session.query(db.exists().where(
            Match.date == dateToCheck)).scalar()
        if exists:
            matches = Match.query.filter_by(date=dateToCheck)
            p = Players()
            returnMatches["matches"] = [{"id": match.id, "date": match.time.isoformat()[:5], "tier": match.tier, "round": match.round, "firstPlayer": match.firstPlayer,
                                         "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds, "pred": ResultsPredictor(unidecode.unidecode(match.firstPlayer.split(" ")[0]), unidecode.unidecode(match.secondPlayer.split(" ")[0]), p.getBasicPlayerData(
                                             unidecode.unidecode(match.firstPlayer.split(" ")[0]))["rank"], p.getBasicPlayerData(unidecode.unidecode(match.secondPlayer.split(" ")[0]))["rank"]).finalPrediction() if p.playerInDf(unidecode.unidecode(match.firstPlayer.split(" ")[0])) and p.playerInDf(unidecode.unidecode(match.secondPlayer.split(" ")[0])) else {"player": "Not known", "points": 0}} for match in matches]
        dateInDb.checked = True
        db.session.commit()
        get_today_odds()

    return jsonify(returnMatches)


@app.route("/get_todays_matches_from_api/<dateToCheck>", methods=["GET"])
def get_todays_matches_from_api(dateToCheck):
    url = f"https://tennis-live-data.p.rapidapi.com/matches-by-date/{dateToCheck}"

    headers = {
        'x-rapidapi-host': "tennis-live-data.p.rapidapi.com",
        'x-rapidapi-key': "53d34c6facmsh98fd17e0f5dbbe4p15651ajsnd6a53a13558a"
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
                                         firstPlayer=unidecode.unidecode(match["home_player"]), secondPlayer=unidecode.unidecode(match["away_player"]), firstOdds=-1, secondOdds=-1))
    else:
        for result in dictionary["results"]:
            for match in result["matches"]:
                if "Qualification" not in match["round_name"]:
                    matchToCheck = Match.query.filter_by(
                        firstPlayer=match["home_player"], secondPlayer=match["away_player"]).first()
                    if matchToCheck:
                        if match["home_id"] == match["result"]["winner_id"]:
                            matchToCheck.result = match["home_player"]
                        else:
                            matchToCheck.result = match["away_player"]
    db.session.commit()
    get_today_odds()
    print("matches")
    API_CHECKS["matches"]["lastChecked"] = datetime.now()
    return "asd"


@app.route("/get_todays_odds", methods=["GET"])
def get_today_odds():
    url = "https://unibet.p.rapidapi.com/competitions-by-sport"

    querystring = {"sport": "tennis"}

    headers = {
        "X-RapidAPI-Host": "unibet.p.rapidapi.com",
        "X-RapidAPI-Key": "53d34c6facmsh98fd17e0f5dbbe4p15651ajsnd6a53a13558a"
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
            print(m)
            player1Name = transformName(m['team1']['name'])
            player2Name = transformName(m['team2']['name'])
            match = Match.query.filter_by(
                firstPlayer=player1Name, secondPlayer=player2Name, date=date.today()).first()
            if match:
                match.firstOdds = m['odds']['1'] if m['odds']['1'] != None else 1
                match.secondOdds = m['odds']['2'] if m['odds']['2'] != None else 1
                db.session.commit()
    delete_matches_with_no_odds()
    API_CHECKS["odds"]["lastChecked"] = datetime.now()
    print("odds")
    return


@app.route('/delete_matches_with_no_odds', methods=["GET"])
def delete_matches_with_no_odds():
    matches = Match.query.filter_by(
        firstOdds=1.2, secondOdds=2.1, date=date.today())
    otherMatches = Match.query.filter_by(
        firstOdds=-1, secondOdds=-1, date=date.today())
    for m in matches:
        db.session.delete(m)
    for om in otherMatches:
        db.session.delete(om)
    db.session.commit()
    todaysMatches = Match.query.filter_by(date=date.today())


def transformName(playerName):
    if not playerName:
        return None

    try:
        shortName = playerName.split(
            ",")[0] + " " + playerName.split(",")[1][1] + "."
    except:
        shortName = playerName.split(
            " ")[0] + " " + playerName.split(" ")[1][1] + "."
    return unidecode.unidecode(shortName)



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
    userBet = Bet(user_id=user.id, date=datetime.now(
    ), betName=data["betsName"] if len(data["betsName"]) > 0 else None)
    db.session.add(userBet)
    db.session.commit()
    for bet in bets:
        betEvent = BetEvent(
            matchId=bet["id"], bettedOn=bet["pred"]["player"], betId=userBet.id)
        db.session.add(betEvent)
    db.session.commit()
    return "a"


@app.route("/get_users_bets", methods=["POST"])
def get_users_bets():
    data = request.get_json(force=True)
    userEmail = jwt.decode(
        data["token"], os.environ.get('JWT_SECRET_KEY'), algorithms=["HS256"])["user"]
    user = User.query.filter_by(email=userEmail).first()
    betType = data["betType"]
    returnBets = {}
    betsToReturn = {}
    for bet in user.bets:
        if(bet.betName):
            key = bet.betName
        else:
            key = str(bet.date)
        betsToReturn[key] = []
        for e in bet.betEvents:
            match = Match.query.filter_by(id=e.matchId).first()
            if match:
                betsToReturn[key].append({
                    "bettedOn": e.bettedOn, "firstPlayer": match.firstPlayer, "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds, "result": match.result})
    betsToReturn = {key: value for key,
                    value in betsToReturn.items() if len(value) > 0}
    results = {}
    if betType == "all":
        for key in betsToReturn.keys():
            status = "Pending"
            for match in betsToReturn[key]:
                if match["result"] != match["bettedOn"] and match["result"] != None:
                    status = "Lost"
                    break
                elif match["result"] == None:
                    status = "Pending"
                    break
                else:
                    status = "Won"
            results[key] = status
        returnBets["results"] = results
        returnBets["bets"] = betsToReturn
    else:
        for key in betsToReturn.keys():
            status = "Pending"
            for match in betsToReturn[key]:
                if match["result"] != match["bettedOn"] and match["result"] != None:
                    status = "Lost"
                    break
                elif match["result"] == None:
                    status = "Pending"
                    break
                else:
                    status = "Won"
            if status.lower() == betType:
                results[key] = status
        returnBets["results"] = results
        returnBets["bets"] = {key: value for key,
                              value in betsToReturn.items() if key in results.keys()}

    return jsonify(returnBets)


@app.route("/sample_matches", methods=["GET"])
def sample_matches():
    match1 = Match(date=date.today(), time=time(10, 0), round="1/16", tier="WTA1000",
                   firstPlayer="Badosa P.", secondPlayer="Bencic B.", firstOdds=1.54, secondOdds=2.2)
    match2 = Match(date=date.today(), time=time(10, 0), round="1/16", tier="WTA1000",
                   firstPlayer="Keys M.", secondPlayer="Cornet A.", firstOdds=1.78, secondOdds=1.9)
    match3 = Match(date=date.today(), time=time(10, 0), round="1/16", tier="WTA1000",
                   firstPlayer="Sakkari M.", secondPlayer="Collins D.", firstOdds=1.7, secondOdds=2.02)
    db.session.add(match1)
    db.session.add(match2)
    db.session.add(match3)
    db.session.commit()


@app.route("/sample_matches_yesterday", methods=["GET"])
def sample_matches_yesterday():
    #matches = Match.query.filter_by(date=date.today() - timedelta(days=1))
    dateInDb = Dates.query.filter_by(date=date.today()).first()
    dateInDb.checked = False
    db.session.commit()
    matches = Match.query.filter_by(date=date.today())
    for match in matches:
        db.session.delete(match)
    db.session.commit()
    """match1 = Match(date=date.today() - timedelta(days=1), time=time(10, 0), round="1/16", tier="WTA1000",
                   firstPlayer="Anisimova A.", secondPlayer="Zidansek T.", firstOdds=1.8, secondOdds=1.8, result='Anisimova A.')
    match2 = Match(date=date.today() - timedelta(days=1), time=time(10, 0), round="1/16", tier="WTA1000",
                   firstPlayer="Swiatek I.", secondPlayer="Pliskova K.", firstOdds=1.78, secondOdds=1.9, result='Swiatek I.')
    match3 = Match(date=date.today() - timedelta(days=1), time=time(10, 0), round="1/16", tier="WTA1000",
                   firstPlayer="Jabeur O.", secondPlayer="Krejcikova B.", firstOdds=1.7, secondOdds=2.02, result='Krejcikova B.')
    db.session.add(match1)
    db.session.add(match2)
    db.session.add(match3)
    db.session.commit()"""


@app.route("/sample_bets", methods=["GET"])
def sample_bets():
    bets = [{"id": 22, "bettedOn": "Anisimova A."},
            {"id": 24, "bettedOn": "Jabeur O."}]
    user = User.query.filter_by(email="admin@admin.com").first()
    userBet = Bet(user_id=user.id, date=datetime.now(
    ), betName="sample_bet")
    db.session.add(userBet)
    db.session.commit()
    for bet in bets:
        betEvent = BetEvent(
            matchId=bet["id"], bettedOn=bet["bettedOn"], betId=userBet.id)
        db.session.add(betEvent)
    db.session.commit()


@app.route("/sample_bets_won", methods=["GET"])
def sample_bets_won():
    bets = [{"id": 22, "bettedOn": "Anisimova A."},
            {"id": 23, "bettedOn": "Swiatek I."}]
    user = User.query.filter_by(email="admin@admin.com").first()
    userBet = Bet(user_id=user.id, date=datetime.now(
    ), betName="sample_bet")
    db.session.add(userBet)
    db.session.commit()
    for bet in bets:
        betEvent = BetEvent(
            matchId=bet["id"], bettedOn=bet["bettedOn"], betId=userBet.id)
        db.session.add(betEvent)
    db.session.commit()


@app.route("/today_match", methods=["GET"])
def today_match():
    matches = Match.query.filter_by(date=date.today())
    for m in matches:
        print(m)
