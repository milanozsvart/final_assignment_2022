from BetHandling import BetHandling
from OverallPlayerData import OverallPlayerData
from backend_betting_app.models import User, Dates, Match, BetEvent, Bet
from Players import Players
from MatchesDatabaseHandler import MatchesDatabaseHandler
from MatchesApiHandler import MatchesApiHandler
from Authentication import Authenctication
from flask_cors import CORS
from backend_betting_app import app
from backend_betting_app import db
from StatsCalculator import StatsCalculator
from datetime import date, time, datetime
from flask import request, jsonify
import json
from RequestValidator import RequestValidator


CORS(app, resources={"*": {"origins": r"http://localhost:3000"}})


@app.route("/")
def home():
    pass


@app.route("/get_basic_player_data", methods=["POST"])
def get_basic_player_data():
    data = request.get_json(force=True)
    r = RequestValidator()
    if r.validate(data, r.singlePlayerSchema) or r.validate(data, r.multiplePlayerSchema):
        playerName = data['playerName']
        additionalProps = data['additionalProps']
        overAllPlayerGetter = OverallPlayerData(additionalProps)
        stats = overAllPlayerGetter.getPlayerData(playerName,
                                                  isinstance(playerName, list))
        if "message"in stats:
            return json.dumps(stats), 404
        return json.dumps(stats)
    else:
        return {"message": "Bad request"}, 400


@app.route("/get_reached_players", methods=["POST"])
def get_reached_players():
    data = request.get_json(force=True)
    r = RequestValidator()
    if r.validate(data, r.reachedPlayerSchema):
        partOfPlayerName = data['partOfPlayerName'].lower()
        playerGetter = Players()
        reachedPlayers = playerGetter.getReachedPlayers(partOfPlayerName)
        return json.dumps(reachedPlayers)
    else:
        return {"message": "Bad request"}, 400


@app.route("/get_matches_data", methods=["POST"])
def get_matches_data():
    data = request.get_json(force=True)
    r = RequestValidator()
    if r.validate(data, r.matchesSchema):
        statCalculator = StatsCalculator(
            data['playerName'], data["additionalProps"])
        matches = statCalculator.getPlayerMatchesAgainstOpponents(
            data['opponentRanks'], data['category'])
        return jsonify(matches)
    else:
        return {"message": "Bad request"}, 400


@app.route("/get_todays_matches_from_db/<dateToCheck>", methods=["GET"])
def get_todays_matches_from_db(dateToCheck):
    matchHandler = MatchesDatabaseHandler()
    return matchHandler.getMatches(dateToCheck)


@app.route("/get_todays_matches_from_api/<dateToCheck>", methods=["GET"])
def get_todays_matches_from_api(dateToCheck):
    apiHandler = MatchesApiHandler(dateToCheck)
    return apiHandler.getMatchesFromAPI()


@app.route("/get_todays_odds", methods=["GET"])
def get_today_odds():
    apiHandler = MatchesApiHandler()
    return apiHandler.getTodaysOddsFromAPI()


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True)
    r = RequestValidator()
    if(r.validate(data, r.emailPasswordSchema)):
        auth = Authenctication()
        return auth.register(data["email"], data["password"])
    else:
        return {"message": "Bad request"}, 400


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    r = RequestValidator()
    if(r.validate(data, r.emailPasswordSchema)):
        auth = Authenctication()
        return auth.login(data["email"], data["password"])
    else:
        return {"message": "Bad request"}, 400

@app.route("/change_password", methods=["POST"])
def change_password():
    data = request.get_json(force=True)
    r = RequestValidator()
    if(r.validate(data, r.changePasswordSchema)):
        auth = Authenctication()
        return auth.changePassword(data["token"], data["currentPassword"], data["newPassword"])
    else:
        return {"message": "Bad request"}, 400

@app.route("/get_historic_ranks_data", methods=["POST"])
def get_historic_ranks_data():
    data = request.get_json(force=True)
    r = RequestValidator()
    if(r.validate(data, r.singlePlayerSchema)):
        data["additionalProps"]["court"] = 'all'
        data["additionalProps"]["tournament"] = 'All'
        data["additionalProps"]["round"] = 'All'
        s = StatsCalculator(data["playerName"], data["additionalProps"])
        print(s.getHistoricRanksForPlayer())
        return s.getHistoricRanksForPlayer()
    else:
        return {"message": "Bad request"}, 400


@app.route("/add_bet_to_user", methods=["POST"])
def add_bet_to_user():
    data = request.get_json(force=True)
    r = RequestValidator()
    if r.validate(data, r.addToBetsSchema):
        betHandler = BetHandling()
        return betHandler.addBetToUser(data["token"], data["bets"], data["betsName"])
    else:
        print(r.getErrors())
        return {"message": "Bad request"}, 400


@app.route("/get_users_bets", methods=["POST"])
def get_users_bets():
    data = request.get_json(force=True)
    r = RequestValidator()
    print(data)
    if r.validate(data, r.getUserBets):
        betHandler = BetHandling()
        return betHandler.getPlayerBets(data["token"], data["betType"])
    else:
        print(r.getErrors())
        return {"message": "Bad request"}, 400


###### ------------ DEBUG FUNCTIONS FROM HERE --------------------- #######

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
