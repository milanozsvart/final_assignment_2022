from backend_betting_app import db
import jwt
import os
from datetime import datetime
from backend_betting_app.models import User, BetEvent, Bet, Match
from flask import jsonify


class BetHandling:
    def __init__(self):
        self.results = {}
        self.betsToReturn = {}
        self.dates = {}
        self.returnData = {}

    def addBetToUser(self, token, bets, betsName):
        db.create_all()
        userEmail = jwt.decode(
            token, os.environ.get('JWT_SECRET_KEY'), algorithms=["HS256"])["user"]
        user = User.query.filter_by(email=userEmail).first()
        userBet = Bet(user_id=user.id, date=datetime.now(
        ), betName=betsName if len(betsName) > 0 else None)
        db.session.add(userBet)
        db.session.commit()
        for bet in bets:
            betEvent = BetEvent(
                matchId=bet["id"], bettedOn=bet["pred"]["player"], betId=userBet.id)
            db.session.add(betEvent)
        db.session.commit()
        return {"message": "Successfully added bets"}

    def createBetsToReturn(self, user):
        for bet in user.bets:
            if(bet.betName):
                key = bet.betName
            else:
                key = str(bet.date)
            self.betsToReturn[key] = []
            self.dates[key] = str(bet.date)
            for e in bet.betEvents:
                match = Match.query.filter_by(id=e.matchId).first()
                if match:
                    self.betsToReturn[key].append({
                        "bettedOn": e.bettedOn, "firstPlayer": match.firstPlayer, "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds, "result": match.result})
        self.deleteEmptyBets()

    def deleteEmptyBets(self):
        self.betsToReturn = {key: value for key,
                             value in self.betsToReturn.items() if len(value) > 0}
        self.dates = {key: value for key,
                      value in self.dates.items() if key in self.betsToReturn.keys()}

    def selectBetsToReturn(self, betType):
        self.sortOutSelectedBets(betType)
        self.setBetsIntoReturnData(betType)

    def sortOutSelectedBets(self, betType):
        for key in self.betsToReturn.keys():
            status = "Pending"
            for match in self.betsToReturn[key]:
                if match["result"] != match["bettedOn"] and match["result"] != None:
                    status = "Lost"
                    break
                elif match["result"] == None:
                    status = "Pending"
                    break
                else:
                    status = "Won"
            if betType == 'all':
                self.results[key] = status
            if status.lower() == betType:
                self.results[key] = status

    def setBetsIntoReturnData(self, betType):
        self.returnData["results"] = self.results
        if betType == 'all':
            self.returnData["bets"] = self.betsToReturn
            self.returnData["dates"] = self.dates
        else:
            self.returnData["bets"] = {key: value for key,
                                       value in self.betsToReturn.items() if key in self.results.keys()}
            self.returnData["dates"] = {key: value for key,
                                        value in self.dates.items() if key in self.results.keys()}
        self.returnData["dates"] = list(dict(
            sorted(self.returnData["dates"].items(), key=lambda item: item[1])).keys())

    def getPlayerBets(self, token, betType):
        userEmail = jwt.decode(
            token, os.environ.get('JWT_SECRET_KEY'), algorithms=["HS256"])["user"]
        user = User.query.filter_by(email=userEmail).first()
        self.createBetsToReturn(user)
        self.selectBetsToReturn(betType)

        return jsonify(self.returnData)
