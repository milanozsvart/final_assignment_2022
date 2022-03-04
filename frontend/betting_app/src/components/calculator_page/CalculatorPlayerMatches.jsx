import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorPlayerMatches() {
  const { playerMatches, opponentRanks, categorySelected, currentPlayerData } =
    useContext(CalculatorContext);
  return (
    <div>
      <div
        className="player-matches-header performance-stats-ranks"
        style={
          playerMatches.length > 0
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
        <p>{"Opponent's rank: " + opponentRanks}</p>
        <p>{"Category: " + categorySelected}</p>
      </div>

      <div
        className="player-matches player-matches-data-header"
        style={
          playerMatches.length > 0
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
        <p>{"Date"}</p>
        <p>{"Tier"}</p>
        <p>{"Winner"}</p>
        <p>{"Result"}</p>
        <p>{"Loser"}</p>
        <p>{"W odds"}</p>
        <p>{"L odds"}</p>
      </div>
      {playerMatches.map((match) => {
        return (
          <div className="player-matches" key={match["Date"]}>
            <p>{match["Date"]}</p>
            <p>{match["Tier"]}</p>
            <p
              className="winner"
              id={
                match["Winner"].includes(currentPlayerData.surName)
                  ? "current-player-winner"
                  : undefined
              }
            >
              {match["Winner"] + " (" + match["WRank"] + ")"}
            </p>
            <p id="match-result">{match["Wsets"] + ":" + match["Lsets"]}</p>
            <p
              className="loser"
              id={
                match["Loser"].includes(currentPlayerData.surName)
                  ? "current-player-loser"
                  : undefined
              }
            >
              {match["Loser"] + " (" + match["LRank"] + ")"}
            </p>
            <p>{match["B365W"]}</p>
            <p>{match["B365L"]}</p>
          </div>
        );
      })}
    </div>
  );
}
