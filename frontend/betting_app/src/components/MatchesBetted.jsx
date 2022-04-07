import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

export default function MatchesBetted(props) {
  let odds = 1;
  return (
    <div
      className="betted-matches-wrapper"
      style={
        props.betId === props.currentlyOpen
          ? { display: "block" }
          : { display: "none" }
      }
    >
      {props.matches.map((m) => {
        if (
          m["bettedOn"].includes(m["firstPlayer"]) ||
          m["firstPlayer"].includes(m["bettedOn"])
        ) {
          odds *= parseFloat(m["firstOdds"]);
        } else {
          odds *= parseFloat(m["secondOdds"]);
        }
        return (
          <div
            className="bet-item"
            style={
              m["result"]
                ? { backgroundColor: "greenyellow" }
                : { backgroundColor: "lightyellow" }
            }
          >
            <span>{m["firstPlayer"]}</span>
            <span>{m["secondPlayer"]}</span>
            <span>{m["firstOdds"]}</span>
            <span>{m["secondOdds"]}</span>
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="question-mark"
            />
          </div>
        );
      })}
      <span className="odds-span">Odds: {odds.toFixed(3)}</span>
    </div>
  );
}
