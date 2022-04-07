import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";
import { Textfit } from "react-textfit";

export default function CalculatorPlayerMatches() {
  const {
    playerMatches,
    opponentRanks,
    categorySelected,
    currentPlayerData,
    selectedPlayer,
  } = useContext(CalculatorContext);

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
        <Textfit mode="single" max={16} className="individual-match-property">
          {"Date"}
        </Textfit>
        <Textfit mode="single" max={16} className="individual-match-property">
          {"Tier"}
        </Textfit>
        <Textfit mode="single" max={16} className="individual-match-property">
          {"Winner"}
        </Textfit>
        <Textfit mode="single" max={16} className="individual-match-property">
          {"Result"}
        </Textfit>
        <Textfit mode="single" max={16} className="individual-match-property">
          {"Loser"}
        </Textfit>
        <Textfit mode="single" max={16} className="individual-match-property">
          {"W odds"}
        </Textfit>
        <Textfit mode="single" max={16} className="individual-match-property">
          {"L odds"}
        </Textfit>
      </div>
      {playerMatches.map((match) => {
        return (
          <div className="player-matches" key={match["Date"]}>
            <p>{match["Date"]}</p>
            <Textfit
              mode="single"
              max={16}
              className="individual-match-property"
            >
              {match["Tier"]}
            </Textfit>
            <Textfit
              mode="single"
              max={16}
              className="winner individual-match-property"
              id={
                match["Winner"].includes(selectedPlayer)
                  ? "current-player-winner"
                  : undefined
              }
            >
              {match["Winner"] + " (" + match["WRank"] + ")"}
            </Textfit>
            <p id="match-result">{match["Wsets"] + ":" + match["Lsets"]}</p>
            <Textfit
              mode="single"
              max={16}
              className="loser individual-match-property"
              id={
                match["Loser"].includes(selectedPlayer)
                  ? "current-player-loser"
                  : undefined
              }
            >
              {match["Loser"] + " (" + match["LRank"] + ")"}
            </Textfit>
            <p>{match["B365W"]}</p>
            <p>{match["B365L"]}</p>
          </div>
        );
      })}
    </div>
  );
}
  

