from datetime import datetime, date
from backend_betting_app import db
from backend_betting_app.models import Dates, Match
from Players import Players
from ResultsPredictor import ResultsPredictor
from MatchesApiHandler import MatchesApiHandler
from unidecode import unidecode
from flask import jsonify


class MatchesDatabaseHandler():
    def __init__(self):
        pass

    def addDateToDb(self, dateToCheck):
        dateExists = db.session.query(db.exists().where(
            Dates.date == dateToCheck)).scalar()
        if not dateExists:
            db.session.add(Dates(date=dateToCheck))
            db.session.commit()

    def removeSpecialCharacters(self, player):
        if "Sorribes" in player:
            surName = "Sorribes Tormo"
        else:
            surName = player.split(" ")[0]
        return unidecode(surName)

    def createReturnData(self, dateToCheck):
        returnMatches = {"matches": []}
        p = Players()
        matches = Match.query.filter_by(date=dateToCheck)
        returnMatches["matches"] = [
            self.createMatchesData(match, p) for match in matches]
        return returnMatches

    def createMatchesData(self, match, playerGetter):
        matchData = {"id": match.id, "result": match.result,
                     "tier": match.tier, "round": match.round, "date": match.time.isoformat()[:5], "firstPlayer": match.firstPlayer,
                     "secondPlayer": match.secondPlayer, "firstOdds": match.firstOdds, "secondOdds": match.secondOdds}
        player1 = self.removeSpecialCharacters(match.firstPlayer)
        player2 = self.removeSpecialCharacters(match.secondPlayer)

        if self.bothPlayersExist(player1, player2, playerGetter):
            player1Rank = playerGetter.getBasicPlayerData(player1)["rank"]
            player2Rank = playerGetter.getBasicPlayerData(player2)["rank"]
            predictor = ResultsPredictor(
                player1, player2, player1Rank, player2Rank)
            matchData["pred"] = predictor.finalPrediction()
        else:
            matchData["pred"] = {"player": "Not known", "points": 0}
        return matchData

    def bothPlayersExist(self, player1, player2, playerGetter):
        player1Exists = playerGetter.playerInDf(
            player1)
        player2Exists = playerGetter.playerInDf(player2)

        return (player1Exists and player2Exists)

    def getMatches(self, dateToCheck):
        db.create_all()
        dateToCheck = datetime.strptime(dateToCheck, "%Y-%m-%d").date()
        returnMatches = {"matches": []}
        self.addDateToDb(dateToCheck)
        dateInDb = Dates.query.filter_by(date=dateToCheck).first()
        dateChecked = dateInDb.checked
        if dateChecked:
            exists = db.session.query(db.exists().where(
                Match.date == dateToCheck)).scalar()
            if exists:
                returnMatches = self.getMatchesFromDb(dateToCheck, dateInDb)
        else:
            returnMatches = self.getDataFromApis(dateToCheck)
        returnMatches["matches"].sort(key=lambda item: item["date"])
        dateInDb.checked = True
        db.session.commit()
        return jsonify(returnMatches)

    def getMatchesFromDb(self, dateToCheck, dateInDb):
        apiHandler = MatchesApiHandler(dateToCheck)
        if str(dateToCheck) != date.today().isoformat():
            if not dateInDb.resultChecked:
                apiHandler.getMatchesFromAPI()
                dateInDb.resultChecked = True
            returnMatches = self.createReturnData(dateToCheck)
        else:
            returnMatches = self.createReturnData(dateToCheck)
        return returnMatches

    def getDataFromApis(self, dateToCheck):
        apiHandler = MatchesApiHandler(dateToCheck)
        apiHandler.getMatchesFromAPI()
        exists = db.session.query(db.exists().where(
            Match.date == dateToCheck)).scalar()
        if exists:
            returnMatches = self.createReturnData(dateToCheck)
        else:
            returnMatches = {"matches": []}
        db.session.commit()
        apiHandler.getTodaysOddsFromAPI()
        return returnMatches
