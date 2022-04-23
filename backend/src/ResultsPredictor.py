import pandas as pd
from datetime import datetime
from pathlib import Path
import os

class ResultsPredictor():
    def __init__(self, player1, player2, player1Rank, player2Rank):
        self.player1odds = 0
        self.player2odds = 0
        self.player1 = player1.lower()
        self.player2 = player2.lower()
        self.player1Rank = int(float(player1Rank))
        self.player2Rank = int(float(player2Rank))
        self.statsLocation = str(Path(os.path.dirname(os.path.dirname(
            os.path.realpath(__file__))) + "\csv\matches.csv"))
        self.df = pd.read_csv(self.statsLocation, sep=";")
        self.setIndexOfDataFrame('Winner')
        self.definePlayer1()
        self.definePlayer2()
        self.cleanUpTournamentData()
        self.setDate()
        self.points = {"1st Round": 1, "2nd Round": 1.05, "3rd Round": 1.1,
                       "4th Round": 1.2, "Quarterfinals": 1.3, "Semifinals": 1.45, "The Final": 1.65}
        # self.setTier()

    def setIndexOfDataFrame(self, propertyAsIndex):
        self.df.set_index(propertyAsIndex, inplace=True, drop=False)

    def setDate(self):
        self.df = self.df[self.df['DateAsDate'] >=
                          datetime.strptime("2021-09-24", "%Y-%m-%d")]

    def cleanUpTournamentData(self):
        self.df['Tier'] = self.df['Tier'].apply(
            lambda x: 'WTA250' if 'WTA2' in x else x)
        self.df['DateAsDate'] = self.df['Date'].apply(
            lambda x: pd.Timestamp(x))

    def definePlayer1(self):
        for index in self.df.index:
            if self.player1 in index.lower():
                self.player1 = index
                break

    def definePlayer2(self):
        for index in self.df.index:
            if self.player2 in index.lower():
                self.player2 = index
                break

    def setTier(self):
        tier = "WTA1000"
        if tier != "All":
            self.df = self.df[self.df["Tier"] == tier]

    def getPlayerMatches(self, won, player, startingRank, endingRank):
        if won:
            self.setIndexOfDataFrame('Winner')
        else:
            self.setIndexOfDataFrame('Loser')

        try:
            playersDf = self.df.loc[player]
            df = playersDf[(playersDf["LRank" if won else "WRank"] >= startingRank) &
                           (playersDf["LRank" if won else "WRank"] <= endingRank) & (playersDf['Comment'] == 'Completed')]
        except:
            playersDf = pd.DataFrame()
            df = pd.DataFrame()
        return {"playersDf": playersDf, "df": df}

    def countMatchesAccordingToTier(self, player, opponentRank):
        startingRank = max(1, int(float(opponentRank))-8)
        endingRank = min(1000, int(float(opponentRank))+10)
        points = 0
        matchesCount = 0
        wonMatches = self.getPlayerMatches(
            True, player, startingRank, endingRank)
        lostMatches = self.getPlayerMatches(
            False, player, startingRank, endingRank)
        fullDf = pd.concat([wonMatches["playersDf"], lostMatches["playersDf"]])
        ranksDf = pd.concat([wonMatches["df"], lostMatches["df"]])
        matches = fullDf.to_dict('records')
        ranks = ranksDf.to_dict('records')
        for match in matches:
            if match['Winner'] == player:
                if match['Tier'] == "WTA250":
                    points += 1 * self.points[match["Round"]]
                elif match['Tier'] == 'WTA500':
                    points += 1.5 * self.points[match["Round"]]
                elif match['Tier'] == 'WTA1000':
                    points += 2 * self.points[match["Round"]]
                elif match['Tier'] == 'Grand Slam':
                    points += 2.5 * self.points[match["Round"]]
            else:
                if match['Tier'] == 'WTA1000':
                    points += 0.2 * self.points[match["Round"]]
                elif match['Tier'] == 'Grand Slam':
                    points += 0.5 * self.points[match["Round"]]
            matchesCount += 1
        for rank in ranks:
            if rank['Winner'] == player:
                matchesCount += 1
                if rank['Tier'] == "WTA250":
                    points += 1.75 * self.points[match["Round"]]
                elif rank['Tier'] == 'WTA500':
                    points += 2.25 * self.points[match["Round"]]
                elif rank['Tier'] == 'WTA1000':
                    points += 2.75 * self.points[match["Round"]]
                elif rank['Tier'] == 'Grand Slam':
                    points += 3.25 * self.points[match["Round"]]

        return [points, matchesCount]

    def finalPrediction(self):
        player1Points = self.countMatchesAccordingToTier(
            self.player1, self.player2Rank)
        player2Points = self.countMatchesAccordingToTier(
            self.player2, self.player1Rank)
        return {"points": max(player1Points[0], player2Points[0]) / (player1Points[0] + player2Points[0]), "player": self.player1 if player1Points[0] > player2Points[0] else self.player2}
