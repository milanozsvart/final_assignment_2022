import pandas as pd
from datetime import datetime
import math
from pathlib import Path
import os


class StatsCalculator():
    def __init__(self, player, additionalProps):
        self.player = player.lower()
        self.statsLocation = str(Path(os.path.dirname(os.path.dirname(os.path.dirname(
            os.path.realpath(__file__)))) + "\csv\matches.csv"))
        self.df = pd.read_csv(self.statsLocation, sep=";")
        self.cleanUpTournamentData()
        self.setIndexOfDataFrame('Winner')
        self.definePlayer()
        self.additionalProps = additionalProps
        self.setDate()
        self.setSurface()
        self.setTier()
        self.setRound()
        self.startingRanks = [1, 11, 26, 51, 76]
        self.endingRanks = [10, 25, 50, 75, 200]
        self.roundsHierarchy = {'1st Round': 1, '2nd Round': 2, '3rd Round': 3,
                                '4th Round': 4,  'Quarterfinals': 5,  'Semifinals': 6,  'The Final': 7}
        self.resultsHierarcyLow = {1: '2nd Round', 2: '3rd Round', 3: 'Quarterfinals',
                                   5: 'Semifinals', 6: 'Runner-up',  7: 'Tournament Winner'}
        self.resultsHierarcyHigh = {1: '2nd Round', 2: '3rd Round', 3: '4th Round', 4: 'Quarterfinals',
                                    5: 'Semifinals', 6: 'Runner-up',  7: 'Tournament Winner'}

    def cleanUpTournamentData(self):
        self.df['Tier'] = self.df['Tier'].apply(
            lambda x: 'WTA250' if 'WTA2' in x else x)
        self.df['DateAsDate'] = self.df['Date'].apply(
            lambda x: pd.Timestamp(x))

    def setDate(self):
        self.df = self.df[self.df['DateAsDate'] >=
                          datetime.strptime(self.additionalProps['startdate'], "%Y-%m-%d")]

    def setSurface(self):
        court = self.additionalProps["court"].capitalize()
        if court != "All":
            self.df = self.df[self.df["Surface"] == court]

    def setTier(self):
        tier = self.additionalProps["tournament"]
        if tier != "All":
            self.df = self.df[self.df["Tier"] == tier]

    def setRound(self):
        round = self.additionalProps["round"]
        if round != "All":
            if round != "Other":
                self.df = self.df[self.df["Round"] == round]
            else:
                self.df = self.df[(self.df["Round"] != "The Final") & (
                    self.df["Round"] != "Semifinals") & (self.df["Round"] != "Quarterfinals")]

    def getBasicStatDataForPlayer(self):
        return self.countMatches()

    def setIndexOfDataFrame(self, propertyAsIndex):
        self.df.set_index(propertyAsIndex, inplace=True, drop=False)

    def definePlayer(self):
        for index in self.df.index:
            if self.player in index.lower():
                self.player = index
                break

    def countMatches(self):
        matchesCount = 0
        wonMatches = 0
        lostMatches = 0
        self.setIndexOfDataFrame('Winner')
        matchesCount += sum(self.df.index == self.player)
        wonMatches += sum(self.df.index == self.player)
        self.setIndexOfDataFrame('Loser')
        matchesCount += sum(self.df.index == self.player)
        lostMatches += sum(self.df.index == self.player)
        return {"allMatches": str(matchesCount), "wonMatches": str(wonMatches), "lostMatches": str(lostMatches)}

    def bestPerformance(self):
        tournaments = list(set(self.df['Tier'].tolist()))
        self.setIndexOfDataFrame(['Winner', 'Tier'])
        self.bestPerformanceInTournamentTypes = {}
        self.definingBestPerformanceInTournaments(tournaments)
        return self.bestPerformanceInTournamentTypes

    def definingBestPerformanceInTournaments(self, tournaments):
        for tournament in tournaments:
            bestForTournamentType = 0
            try:
                bestForTournamentType = self.lookForPlayersBestPerformanceInTournament(
                    tournament, bestForTournamentType)
            except:
                continue
            self.setBestPerformances(tournament, bestForTournamentType)

    def setBestPerformances(self, tournament, bestForTournamentType):
        for round in self.roundsHierarchy.keys():
            if self.roundsHierarchy[round] == bestForTournamentType:
                if tournament == "Grand Slam" or tournament == "WTA1000":
                    self.bestPerformanceInTournamentTypes[tournament] = self.resultsHierarcyHigh[bestForTournamentType]
                else:
                    self.bestPerformanceInTournamentTypes[tournament] = self.resultsHierarcyLow[bestForTournamentType]
                break

    def lookForPlayersBestPerformanceInTournament(self, tournament, bestForTournamentType):
        playerMatchesInTournamentType = self.df.loc[(
            self.player, tournament), 'Round']
        for match in playerMatchesInTournamentType:
            bestForTournamentType = max(
                bestForTournamentType, self.roundsHierarchy[match])
        return bestForTournamentType

    def performanceAgainstRank(self):
        self.result = {}

        for startingRank, endingRank in zip(self.startingRanks, self.endingRanks):
            self.result[f"{startingRank}-{endingRank}"] = self.performanceBetweenRanks(
                startingRank, endingRank)
        return self.result

    def performanceBetweenRanks(self, startingRank, endingRank):
        numberOfWins = 0
        allMatches = 0
        winnerInStraightSets = 0

        self.setIndexOfDataFrame('Loser')
        try:
            matchesOfPlayer = self.getPlayerMatches()
            for match in matchesOfPlayer:
                if(match["Comment"] == "Completed"):
                    if match["WRank"] <= endingRank and match["WRank"] >= startingRank:
                        allMatches += 1
        except:
            None

        self.setIndexOfDataFrame('Winner')
        try:
            matchesOfPlayer = self.getPlayerMatches()
            for match in matchesOfPlayer:
                if(match["Comment"] == "Completed"):
                    if match["LRank"] <= endingRank and match["LRank"] >= startingRank:
                        allMatches += 1
                        numberOfWins += 1
                        if float(match["Lsets"]) < 1:
                            winnerInStraightSets += 1
        except:
            None

        return {"Matches played": allMatches, "Matches won": numberOfWins, "Matches won 2-0": winnerInStraightSets}

    def getPlayerMatches(self):
        matchesOfPlayer = self.df.loc[[self.player], [
            "Wsets", "Date", "Lsets", "Comment", "WRank", "LRank", "Lsets"]].to_dict("records")

        return matchesOfPlayer

    def getPlayerMatchesAgainstOpponents(self, ranks, category):
        ranks = self.getRanksFromString(ranks)
        self.startingRank = int(ranks[0])
        self.endingRank = int(ranks[1])
        if "won" in category:
            playersDf = self.playerMatchesWithRank('Winner', 'LRank')
            if not playersDf.empty:
                if "2-0" in category:
                    playersDf = playersDf[playersDf['Lsets'] == 0]
                    return sorted(playersDf.to_dict("records"), key=lambda k: k['Date'])
                return sorted(playersDf.to_dict("records"), key=lambda k: k['Date'])
        elif "lost" in category:
            playersDf = self.playerMatchesWithRank('Loser', 'WRank')
            if not playersDf.empty:
                return sorted(playersDf.to_dict("records"), key=lambda k: k['Date'])
        else:
            playersDf = pd.concat([self.playerMatchesWithRank(
                'Winner', 'LRank'), self.playerMatchesWithRank('Loser', 'WRank')])
            if not playersDf.empty:
                return sorted(playersDf.to_dict("records"), key=lambda k: k['Date'])
        return []

    def playerMatchesWithRank(self, result, rankToCheck):
        self.setIndexOfDataFrame(result)
        try:
            playersDf = self.df.loc[self.player]
            if (not isinstance(playersDf, pd.DataFrame)):
                playersDf.reset_index(drop=False)
                playersDf = playersDf.to_frame().transpose()
            playersDf = playersDf[(playersDf[rankToCheck] >= self.startingRank) &
                                  (playersDf[rankToCheck] <= self.endingRank) & (playersDf['Comment'] == 'Completed')]
            playersDf = playersDf[['Winner', 'Loser', 'Date',
                                   'Tier', 'WRank', 'LRank', 'B365W', 'B365L', 'Wsets', 'Lsets']]
        except:
            playersDf = pd.DataFrame()

        return playersDf

    def getRanksFromString(self, ranks):
        return ranks.split("-")

    def getHistoricRanksForPlayer(self):
        self.setIndexOfDataFrame('Winner')
        playersDfWon = self.df.loc[self.player][["WRank", "DateAsDate"]]
        self.setIndexOfDataFrame('Loser')
        playersDfLost = self.df.loc[self.player][["LRank", "DateAsDate"]]
        newDf = pd.concat([playersDfWon, playersDfLost])
        newDf = newDf.sort_values(by=['DateAsDate'], ascending=True)[
            ['WRank', 'LRank', 'DateAsDate']]

        newDf["LRank"] = newDf["LRank"].apply(
            lambda x: x if (not math.isnan(float(x))) else 0)
        newDf["WRank"] = newDf["WRank"].apply(
            lambda x: x if (not math.isnan(float(x))) else 0)
        newDf['Rank'] = newDf['WRank'] + newDf['LRank']
        newDf = newDf[['Rank', 'DateAsDate']].to_dict("records")
        response = {"data": newDf}
        return self.createListFromDict(newDf)

    def createListFromDict(self, dictionaries):
        dates = [d["DateAsDate"] for d in dictionaries]
        ranks = [d["Rank"] for d in dictionaries]
        return {"dates": dates, "ranks": ranks, "player": self.player}
