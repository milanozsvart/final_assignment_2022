from numpy import isin
import pandas as pd
import json


class Players():
    def __init__(self):
        self.playersStoreLocation = r'C:\Users\milan\Desktop\szakdolgozat2022\backend\webscraper\players.csv'
        self.df = pd.read_csv(self.playersStoreLocation)
        print(self.df.info())

    def setIndexOfDataFrame(self, propertyAsIndex):
        self.df.set_index(propertyAsIndex, inplace=True, drop=False)

    def getBasicPlayerData(self, playerName):
        self.setIndexOfDataFrame('surName')
        return self.getDataBasedOnListOfProperties(
            ['surName', 'firstName', 'rank', 'flag'], playerName)

    def getDataBasedOnProperty(self, propertyToCheck, ownerOfProperty):
        data = self.df.loc[ownerOfProperty, propertyToCheck]
        if isinstance(data, pd.Series):
            return self.df.loc[ownerOfProperty, propertyToCheck][0]
        return self.df.loc[ownerOfProperty, propertyToCheck]

    def setDataBasedOnProperty(self, propertyToSet, ownerOfProperty):
        if propertyToSet == "flag":
            nationality = self.getDataBasedOnProperty(
                'nationality', ownerOfProperty).lower()
            if "czech" in nationality:
                nationality = "czechia"
            if "russia" in nationality:
                nationality = "rus"
            return f"https://countryflagsapi.com/png/{nationality}"

    def getDataBasedOnListOfProperties(self, propertiesToCheck, ownerOfPoperty):
        data = {}
        for property in propertiesToCheck:
            try:
                data[property] = str(self.getDataBasedOnProperty(
                    property, ownerOfPoperty))
            except:
                data[property] = str(self.setDataBasedOnProperty(
                    property, ownerOfPoperty))
        return data

    def getReachedPlayers(self, playerNamePart):
        self.namesWithPart = {'values': []}
        if self.emptyStringForReachedPlayers(playerNamePart):
            return self.namesWithPart

        self.setIndexOfDataFrame('surName')
        return self.searchForSurnames(playerNamePart)

    def searchForSurnames(self, playerNamePart):
        for index in self.df.index:
            if playerNamePart in str(index).lower():
                self.selectNamesToReturn(index)
                if len(self.namesWithPart['values']) > 2:
                    return self.namesWithPart
        return self.namesWithPart

    def lookForFirstNames(self, surName):
        return self.df.loc[[surName], 'firstName'].tolist()

    def selectNamesToReturn(self, surName):
        firstNames = self.lookForFirstNames(surName)
        for firstName in firstNames:
            fullName = str(surName) + ", " + str(firstName)
            self.namesWithPart['values'].append(fullName)

    def emptyStringForReachedPlayers(self, playerNamePart):
        return len(playerNamePart) < 1

    def playerInDf(self, playerName):
        self.setIndexOfDataFrame('surName')
        return playerName in self.df.index
