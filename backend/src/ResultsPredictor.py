import pandas as pd
from datetime import datetime


class ResultsPredictor():
    def __init__(self, player1, player2, player1Rank, player2Rank):
        self.player1odds = 0
        self.player2odds = 0
        self.player1 = player1.lower()
        self.player2 = player2.lower()
        self.player1Rank = int(float(player1Rank))
        self.player2Rank = int(float(player2Rank))
        self.statsLocation = r'C:\Users\milan\Desktop\Dokumentumok\python_workspace\betting_app\csv\2021-women.csv'
        self.df = pd.read_csv(self.statsLocation, sep=";")
        self.setIndexOfDataFrame('Winner')
        self.definePlayer1()
        self.definePlayer2()
        self.cleanUpTournamentData()
        self.setDate()
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

    def countMatches(self, player, opponentRank):
        startingRank = max(1, int(float(opponentRank))-8)
        endingRank = min(1000, int(float(opponentRank))+10)
        matchesCount = 0
        wonMatches = 0
        lostMatches = 0
        self.setIndexOfDataFrame('Winner')
        matchesCount += sum(self.df.index == player)
        wonMatches += sum(self.df.index == player)
        try:
            playersDf = self.df.loc[player]
            if (not isinstance(playersDf, pd.DataFrame)):
                playersDf.reset_index(drop=False)
                playersDf = playersDf.to_frame().transpose()
            playersDf = playersDf[(playersDf["LRank"] >= startingRank) &
                                  (playersDf["LRank"] <= endingRank) & (playersDf['Comment'] == 'Completed')]
            playersDf = playersDf[['Winner', 'Loser', 'Date',
                                   'Tier', 'WRank', 'LRank', 'B365W', 'B365L', 'Wsets', 'Lsets']]
        except:
            playersDf = pd.DataFrame()
        matchesCountAgainstRank = sum(playersDf.index == player)
        wonAgainstRank = sum(playersDf.index == player)
        self.setIndexOfDataFrame('Loser')
        matchesCount += sum(self.df.index == player)
        lostMatches += sum(self.df.index == player)
        try:
            playersDf = self.df.loc[player]
            if (not isinstance(playersDf, pd.DataFrame)):
                playersDf.reset_index(drop=False)
                playersDf = playersDf.to_frame().transpose()
            playersDf = playersDf[(playersDf["WRank"] >= startingRank) &
                                  (playersDf["WRank"] <= endingRank) & (playersDf['Comment'] == 'Completed')]
            playersDf = playersDf[['Winner', 'Loser', 'Date',
                                   'Tier', 'WRank', 'LRank', 'B365W', 'B365L', 'Wsets', 'Lsets']]
        except:
            playersDf = pd.DataFrame()
        matchesCountAgainstRank += sum(playersDf.index == player)
        lostAgainstRank = sum(playersDf.index == player)
        return {"allMatches": matchesCount, "wonMatches": wonMatches, "lostMatches": lostMatches, "wonPercentage": wonMatches/matchesCount if wonMatches > 0 and matchesCount > 0 else 0, "matchesCountAgainstRank": matchesCountAgainstRank, "wonAgainstRank": wonAgainstRank, "lostAgainstRank": lostAgainstRank, "wonPercentageAgainstRank": wonAgainstRank/matchesCountAgainstRank if wonAgainstRank > 0 and matchesCountAgainstRank > 0 else 0}

    def setTier(self):
        tier = "WTA1000"
        if tier != "All":
            self.df = self.df[self.df["Tier"] == tier]

    def isOnStreak(self, player):
        self.setIndexOfDataFrame('Winner')
        playersDfWon = self.df.loc[player]
        self.setIndexOfDataFrame('Loser')
        playersDfLost = self.df.loc[player]
        newDf = pd.concat([playersDfWon, playersDfLost])
        newDf = newDf.sort_values(by=['DateAsDate'], ascending=False)[
            ['Winner', 'Loser', 'Tier', 'Tournament', 'Round', 'B365W', 'B365L', 'WRank', 'LRank', 'Lsets', 'Comment']]
        newDf.set_index('Tournament', inplace=True, drop=False)
        a = list(dict.fromkeys(newDf.index))
        newDf = newDf.loc[a]

    def isUnDiscovered(self, player):
        try:
            self.setIndexOfDataFrame(['Winner', 'WRank'])
            playersDfWon = self.df.loc[player]
        except:
            playersDfWon = pd.DataFrame(
                columns=['Winner', 'Loser', 'WRank', 'LRank', 'DateAsDate'])
        try:
            self.setIndexOfDataFrame(['Loser', 'LRank'])
            playersDfLost = self.df.loc[player]
        except:
            playersDfLost = pd.DataFrame(
                columns=['Winner', 'Loser', 'WRank', 'LRank', 'DateAsDate'])
        newDf = pd.concat([playersDfWon, playersDfLost])
        newDf = newDf.sort_values(by=['DateAsDate'], ascending=False).head(10)[
            ['Winner', 'Loser', 'WRank', 'LRank', 'DateAsDate']]
        progress = newDf.tail(1).index / newDf.head(1).index
        try:
            return progress[0] > 2
        except:
            return False

    def analysePlayerMatchesData(self):
        player1Matches = self.countMatches(self.player1, self.player2Rank)
        player2Matches = self.countMatches(self.player2, self.player1Rank)
        player1Losing = (1-player1Matches["wonPercentage"]) * \
            player1Matches["lostMatches"]
        player2Losing = (1-player2Matches["wonPercentage"]) * \
            player2Matches["lostMatches"]
        player1Winning = player1Matches["wonPercentage"] * \
            player1Matches["wonMatches"] - player1Losing
        player2Winning = player2Matches["wonPercentage"] * \
            player2Matches["wonMatches"] - player2Losing
        player1RanksWinning = player1Matches["wonPercentageAgainstRank"] * \
            player1Matches["wonAgainstRank"]
        player2RanksWinning = player2Matches["wonPercentageAgainstRank"] * \
            player2Matches["wonAgainstRank"]
        better = self.player1 if player1Winning > player2Winning else self.player2
        if better == self.player1:
            self.player1odds += (player1Winning-player2Winning) * \
                ((self.player2Rank - self.player1Rank) / 50)
            self.player2odds += (player1Winning-player2Winning) * \
                ((self.player1Rank - self.player2Rank) / 50)
        else:
            self.player2odds += (player2Winning -
                                 player1Winning)*((self.player1Rank - self.player2Rank) / 50)
            self.player1odds += (player2Winning -
                                 player1Winning)*((self.player2Rank - self.player1Rank) / 50)
        betterRanks = self.player1 if player1RanksWinning > player2RanksWinning else self.player2
        if betterRanks == self.player1:
            self.player1odds += (player1RanksWinning-player2RanksWinning) * \
                ((self.player2Rank - self.player1Rank) / 50) * 4
            self.player2odds += (player1RanksWinning-player2RanksWinning) * \
                ((self.player1Rank - self.player2Rank) / 50) * 4
        else:
            self.player2odds += (player2RanksWinning -
                                 player1RanksWinning)*((self.player1Rank - self.player2Rank) / 50) * 4
            self.player1odds += (player2RanksWinning -
                                 player1RanksWinning)*((self.player2Rank - self.player1Rank) / 50) * 4
        if(self.isUnDiscovered(self.player1)):
            self.player1odds += abs(self.player1odds) * 0.4 + self.player1odds
        if(self.isUnDiscovered(self.player2)):
            self.player2odds += abs(self.player2odds) * 0.4 + self.player2odds

        return {"points": abs(self.player1odds)+abs(self.player2odds), "player": self.player1 if self.player1odds > self.player2odds else self.player2}

    def countMatchesAccordingToTier(self, player, opponentRank):
        startingRank = max(1, int(float(opponentRank))-8)
        endingRank = min(1000, int(float(opponentRank))+10)
        points = 0
        matchesCount = 0
        self.setIndexOfDataFrame('Winner')
        try:
            playersDfWon = self.df.loc[player]
            wonDf = playersDfWon[(playersDfWon["LRank"] >= startingRank) &
                             (playersDfWon["LRank"] <= endingRank) & (playersDfWon['Comment'] == 'Completed')]
        except:
            playersDfWon = pd.DataFrame()
            wonDf = pd.DataFrame()
        self.setIndexOfDataFrame('Loser')

        try:
            playersDfLost = self.df.loc[player]
            lostDf = playersDfLost[(playersDfLost["WRank"] >= startingRank) &
                               (playersDfLost["WRank"] <= endingRank) & (playersDfLost['Comment'] == 'Completed')]
        except:
            playersDfLost = pd.DataFrame()
            lostDf = pd.DataFrame()
        fullDf = pd.concat([playersDfWon, playersDfLost])
        ranksDf = pd.concat([wonDf, lostDf])
        matches = fullDf.to_dict('records')
        ranks = ranksDf.to_dict('records')
        for match in matches:
            if match['Winner'] == player:
                if match['Tier'] == "WTA250":
                    points += 1
                elif match['Tier'] == 'WTA500':
                    points += 1.5
                elif match['Tier'] == 'WTA1000':
                    points += 2
                elif match['Tier'] == 'Grand Slam':
                    points += 2.5
            else:
                if match['Tier'] == 'WTA1000':
                    points += 0.2
                elif match['Tier'] == 'Grand Slam':
                    points += 0.5
            matchesCount += 1
        for rank in ranks:
            if rank['Winner'] == player:
                matchesCount += 1
                if rank['Tier'] == "WTA250":
                    points += 1.5
                elif rank['Tier'] == 'WTA500':
                    points += 2
                elif rank['Tier'] == 'WTA1000':
                    points += 2.5
                elif rank['Tier'] == 'Grand Slam':
                    points += 3

        return [points, matchesCount]

    def finalPrediction(self):
        player1Points = self.countMatchesAccordingToTier(
            self.player1, self.player2Rank)
        player2Points = self.countMatchesAccordingToTier(
            self.player2, self.player1Rank)

        print(max(player1Points[0], player2Points[0]) -
              min(player1Points[0], player2Points[0]))
        player = self.player1 if player1Points[0] > player2Points[0] else self.player2
        if player == self.player1:
            print((max(player1Points[0], player2Points[0]) -
                  min(player1Points[0], player2Points[0])) * (1 / player1Points[1]), "prob")
        else:
            print(max(player1Points[0], player2Points[0]) -
                  min(player1Points[0], player2Points[0]) * (1 / player2Points[1]), "prob")

        return {"points": max(player1Points[0], player2Points[0]) - min(player1Points[0], player2Points[0]), "player": self.player1 if player1Points[0] > player2Points[0] else self.player2}
