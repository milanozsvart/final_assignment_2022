from calendar import month
import requests
from backend_betting_app import db
from unidecode import unidecode
from datetime import date, time
from backend_betting_app.models import Match
import os
from time import sleep


class MatchesApiHandler():
    def __init__(self, dateToCheck=date.today().isoformat()):
        self.dateToCheck = dateToCheck
        self.matchesURL = f"https://tennis-live-data.p.rapidapi.com/matches-by-date/{self.dateToCheck}"
        self.competitionsURl = "https://unibet.p.rapidapi.com/competitions-by-sport"
        self.competitionsQuery = {"sport": "tennis"}
        self.oddsURL = "https://unibet.p.rapidapi.com/matches-by-competition"
        self.matchHeaders = {
            'x-rapidapi-host': "tennis-live-data.p.rapidapi.com",
            'x-rapidapi-key': os.environ.get('API_KEY')
        }
        self.oddsHeaders = {
            "X-RapidAPI-Host": "unibet.p.rapidapi.com",
            "X-RapidAPI-Key": os.environ.get('API_KEY')
        }

    def deleteMensMatches(self, APIresult):
        del APIresult['meta']
        for result in APIresult["results"]:
            if result["tournament"]["code"] != "WTA":
                APIresult["results"].remove(result)

    def getMatchesFromAPI(self):
        response = requests.request(
            "GET", self.matchesURL, headers=self.matchHeaders)
        if response.ok:
            APIresult = response.json()
            db.create_all()
            self.deleteMensMatches(APIresult)
            for result in APIresult["results"]:
                for match in result["matches"]:
                    if "Qualification" not in match["round_name"]:
                        matchToCheck = self.selectCurrentMatchFromDb(match)
                        if matchToCheck and match["status"] == "finished":
                            self.addResultToExistingMatch(matchToCheck, match)
                        elif not matchToCheck:
                            self.addMatchToDb(match)
            db.session.commit()
            self.getTodaysOddsFromAPI()
            return {"message": "Success"}
        else:
            return {"message": response.text}

    def addResultToExistingMatch(self, matchToCheck, match):
        if match["home_id"] == match["result"]["winner_id"]:
            matchToCheck.result = match["home_player"]
        elif match["away_id"] == match["result"]["winner_id"]:
            matchToCheck.result = match["away_player"]
        else:
            matchToCheck.result = None

    def selectCurrentMatchFromDb(self, match):
        return Match.query.filter_by(
            firstPlayer=unidecode(match["home_player"]), secondPlayer=unidecode(match["away_player"]), date=self.dateToCheck).first()

    def addMatchToDb(self, match):
        year = int(match["date"][:4])
        month = int(match["date"][5:7])
        day = int(match["date"][8:10])
        hours = int(match["date"][11:13])
        minutes = int(match["date"][14:16])
        db.session.add(Match(date=date(year, month, day), time=time(hours, minutes), round=match["round_name"], tier="WTA1000",
                             firstPlayer=unidecode(match["home_player"]), secondPlayer=unidecode(match["away_player"]), firstOdds=-1, secondOdds=-1))

    def getTodaysOddsFromAPI(self):
        response = requests.request(
            "GET", self.competitionsURl, headers=self.oddsHeaders, params=self.competitionsQuery)
        if response.ok:
            tournaments = response.json()
            womensTournaments = [t["id"]
                                 for t in tournaments if "tennis/wta/" in t["id"]]
            # needed because of API request limit / seconds
            sleep(1.5)
            for wt in womensTournaments:
                querystring = {"competitionid": wt}
                response = requests.request(
                    "GET", self.oddsURL, headers=self.oddsHeaders, params=querystring)
                if response.ok:
                    matches = response.json()
                    # needed because of API request limit / seconds
                    sleep(1.5)
                    for m in matches:
                        self.addOddsToMatches(m)
            self.deleteMatchesWithNoOdds()
            return {"message": "Success"}
        else:
            return {"message": response.text}

    def addOddsToMatches(self, match):
        player1Name = self.transformName(match['team1']['name'])
        player2Name = self.transformName(match['team2']['name'])
        matchInDb = Match.query.filter_by(
            firstPlayer=player1Name, secondPlayer=player2Name, date=date.today()).first()
        if matchInDb:
            matchInDb.firstOdds = match['odds']['1'] if match['odds']['1'] != None else 1
            matchInDb.secondOdds = match['odds']['2'] if match['odds']['2'] != None else 1
            db.session.commit()

    def transformName(self, playerName):
        if not playerName:
            return None

        if "Badosa" in playerName:
            return "Badosa P."

        try:
            shortName = playerName.split(
                ",")[0] + " " + playerName.split(",")[1][1] + "."
        except:
            shortName = playerName.split(
                " ")[0] + " " + playerName.split(" ")[1][1] + "."
        return unidecode(shortName)

    def deleteMatchesWithNoOdds(self):
        matches = Match.query.filter_by(
            firstOdds=-1, secondOdds=-1, date=date.today())
        for m in matches:
            db.session.delete(m)
        db.session.commit()
