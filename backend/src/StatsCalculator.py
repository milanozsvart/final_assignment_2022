import pandas as pd

class StatsCalculator():
    def __init__(self, player):
        self.statsLocation = r'C:\Users\milan\Desktop\Dokumentumok\python_workspace\betting_app\csv\2021-women.csv'
        self.df = pd.read_csv(self.statsLocation, sep=";")
        self.df['Tier'] = self.df['Tier'].apply(lambda x: 'WTA250' if 'WTA2' in x else x)
        self.player = player.lower()
        self.setIndexOfDataFrame('Winner')
        self.definePlayer()
        self.roundsHierarchy = {'1st Round': 1, '2nd Round': 2, '3rd Round': 3, '4th Round': 4,  'Quarterfinals': 5,  'Semifinals': 6,  'The Final': 7}

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
        return {"allMatches": matchesCount, "wonMatches": wonMatches, "lostMatches": lostMatches}

    def bestPerformance(self):
        tournaments = list(set(self.df['Tier'].tolist()))
        playerMatches = self.df.loc[self.player, ['Round', 'Tier']]
        self.setIndexOfDataFrame(['Winner', 'Tier'])
        for tournament in tournaments:
            bestForTournamentType = 0
            try:
                playerMatchesInTournamentType = self.df.loc[(self.player, tournament), 'Round']
                for match in playerMatchesInTournamentType:
                    bestForTournamentType = max(bestForTournamentType, self.roundsHierarchy[match])
            except:
                continue
            print(bestForTournamentType)

