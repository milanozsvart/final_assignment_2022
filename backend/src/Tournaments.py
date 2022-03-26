import pandas as pd


class Tournaments:
    def __init__(self):
        self.df = pd.read_csv(
            r'C:\Users\milan\Desktop\szakdolgozat2022\backend\tournaments.csv')
        self.df.set_index('Tournament', inplace=True, drop=False)

    def getTierForTournament(self, tournamentName):
        return self.df.loc[tournamentName]["Tier"]
