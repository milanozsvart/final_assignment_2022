import pandas as pd

class StatsCalculator():
    def __init__(self, player):
        self.statsLocation = r'C:\Users\milan\Desktop\Dokumentumok\python_workspace\betting_app\csv\2021-women.csv'
        self.df = pd.read_csv(self.statsLocation, sep=";")
        self.cleanUpTournamentData()
        self.player = player.lower()
        self.setIndexOfDataFrame('Winner')
        self.definePlayer()
        self.roundsHierarchy = {'1st Round': 1, '2nd Round': 2, '3rd Round': 3, '4th Round': 4,  'Quarterfinals': 5,  'Semifinals': 6,  'The Final': 7}

    def cleanUpTournamentData(self):
        self.df['Tier'] = self.df['Tier'].apply(
            lambda x: 'WTA250' if 'WTA2' in x else x)

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
                self.bestPerformanceInTournamentTypes[tournament] = round
                break

    def lookForPlayersBestPerformanceInTournament(self, tournament, bestForTournamentType):
        playerMatchesInTournamentType = self.df.loc[(
            self.player, tournament), 'Round']
        for match in playerMatchesInTournamentType:
            bestForTournamentType = max(
                bestForTournamentType, self.roundsHierarchy[match])
        return bestForTournamentType

    def performanceAgainstRank(self):
        self.startingRanks = [1, 11, 26, 51, 76, 111]
        self.endingRanks = [10, 25, 50, 75, 100, 500]
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
        matchesOfPlayer = self.getPlayerMatches()
        for match in matchesOfPlayer:
            if(match["Comment"] == "Completed"):
                if match["WRank"] < endingRank and match["WRank"] > startingRank:
                    allMatches += 1

        self.setIndexOfDataFrame('Winner')
        matchesOfPlayer = self.getPlayerMatches()
        for match in matchesOfPlayer:
            if(match["Comment"] == "Completed"):
                if match["LRank"] < endingRank and match["LRank"] > startingRank:
                    allMatches += 1
                    numberOfWins += 1
                    if float(match["Lsets"]) < 1:
                        winnerInStraightSets += 1
        return {"Matches played": allMatches, "Matches won": numberOfWins, "Matches won 2-0": winnerInStraightSets}

    def getPlayerMatches(self):
        matchesOfPlayer = self.df.loc[[self.player], [
            "Wsets", "Lsets", "Comment", "B365W", "B365L", "WRank", "LRank"]].to_dict("records")

        return matchesOfPlayer

    def getPlayerMatchesAgainstOpponents(self, ranks, category):
        ranks = self.getRanksFromString(ranks)
        startingRank = int(ranks[0])
        endingRank = int(ranks[1])
        if "won" in category:
            self.setIndexOfDataFrame('Winner')
            playersDf = self.df.loc[self.player]
            playersDf = playersDf[playersDf['LRank'] >
                                  startingRank and playersDf['Lrank'] < endingRank]

    def getRanksFromString(self, ranks):
        return ranks.split("-")
