from Players import Players
from ResultsPredictor import ResultsPredictor
from StatsCalculator import StatsCalculator


class OverallPlayerData:
    def __init__(self, additionalProps):
        self.additionalProps = additionalProps
        self.stats = {}
        self.playerGetter = Players()

    def checkIfPlayerExists(self, playerName, multiplePlayers):
        good = True
        namesErrors = []
        if multiplePlayers:
            for player in playerName:
                if not self.playerGetter.playerInDf(player):
                    good = False
                    namesErrors.append(player)
        else:
            if not self.playerGetter.playerInDf(playerName):
                good = False
                namesErrors.append(playerName)
        return {"good": good, "errors": namesErrors}

    def checkIfNamesAreNotTheSame(self, playerName, multiplePlayers):
        if multiplePlayers and playerName[0] == playerName[1]:
            return False
        return True


    def calculatePrediction(self, players):

        predictor = ResultsPredictor(players[0], players[1], self.playerGetter.getBasicPlayerData(
            players[0])["rank"], self.playerGetter.getBasicPlayerData(players[1])["rank"])
        prediction = predictor.finalPrediction()
        return prediction

    def calculatePlayerDataAndPerformance(self, player, players, multiplePlayers, i):
        matchesGetter = StatsCalculator(
            player, self.additionalProps)
        playerData = self.playerGetter.getBasicPlayerData(player)
        bestPerformance = matchesGetter.bestPerformance()
        playerMatchesData = matchesGetter.getBasicStatDataForPlayer()
        playerMatchesData['bestPerformance'] = bestPerformance
        if multiplePlayers:
            fullPlayerStats = {**playerMatchesData, **playerData}
            otherPlayer = players[(i+1) % 2]
            opponentsRank = self.playerGetter.getBasicPlayerData(otherPlayer)[
                "rank"]
            matchesGetter.startingRanks = [
                max(1, int(float(opponentsRank)) - 8)]
            matchesGetter.endingRanks = [
                min(1000, int(float(opponentsRank)) + 10)]
        else:
            self.stats = {**playerMatchesData, **playerData}
        performanceBetweenRanks = matchesGetter.performanceAgainstRank()
        if multiplePlayers:
            fullPlayerStats['performanceBetweenRanks'] = performanceBetweenRanks
            return fullPlayerStats
        else:
            self.stats['performanceBetweenRanks'] = performanceBetweenRanks
            return self.stats

    def getPlayerData(self, playerName, multiplePlayers):
        if not self.checkIfNamesAreNotTheSame(playerName, multiplePlayers):
            return {"message": "Names cannot be the same!"}
        playerExistenceChecker = self.checkIfPlayerExists(
            playerName, multiplePlayers)
        if playerExistenceChecker["good"]:
            i = 0
            if multiplePlayers:
                prediction = self.calculatePrediction(playerName)
                for player in playerName:
                    playerStat = self.calculatePlayerDataAndPerformance(
                        player, playerName, multiplePlayers, i)
                    self.stats[i] = playerStat
                    self.stats["pred"] = prediction
                    i = i + 1
            else:
                self.stats = self.calculatePlayerDataAndPerformance(
                    playerName, playerName, multiplePlayers, i)
            return self.stats
        else:
            return {"message": ', '.join(playerExistenceChecker['errors'])}
