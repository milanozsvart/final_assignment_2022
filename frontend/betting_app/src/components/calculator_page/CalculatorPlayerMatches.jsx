import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorPlayerMatches() {
  const { playerMatches, opponentRanks, categorySelected } =
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
      {playerMatches.map((match) => {
        return (
          <div className="player-matches">
            <p>{match["Date"]}</p>
            <p>{match["Tier"]}</p>
            <p>{match["Winner"] + " (" + match["WRank"] + ")"}</p>
            <p>{match["Wsets"] + ":" + match["Lsets"]}</p>
            <p>{match["Loser"] + " (" + match["LRank"] + ")"}</p>
            <p>{match["B365W"]}</p>
            <p>{match["B365L"]}</p>
          </div>
        );
      })}
    </div>
  );
}
