import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

export default function MatchesBetted(props) {
  let odds = 1;

  const calculateStyle = (match) => {
    if (match["result"] === null) {
      return { backgroundColor: "lightyellow" };
    } else if (match["result"] !== match["bettedOn"]) {
      return { backgroundColor: "red" };
    } else {
      return { backgroundColor: "greenyellow" };
    }
  };
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
          <div className="bet-item" style={calculateStyle(m)}>
            <span
              style={
                m["bettedOn"].includes(m["firstPlayer"]) ||
                m["firstPlayer"].includes(m["bettedOn"])
                  ? { color: "purple" }
                  : {}
              }
            >
              {m["firstPlayer"]}
            </span>
            <span
              style={
                m["bettedOn"].includes(m["secondPlayer"]) ||
                m["secondPlayer"].includes(m["bettedOn"])
                  ? { color: "purple" }
                  : {}
              }
            >
              {m["secondPlayer"]}
            </span>
            <span
              style={
                m["bettedOn"].includes(m["firstPlayer"]) ||
                m["firstPlayer"].includes(m["bettedOn"])
                  ? { color: "purple" }
                  : {}
              }
            >
              {m["firstOdds"]}
            </span>
            <span
              style={
                m["bettedOn"].includes(m["secondPlayer"]) ||
                m["secondPlayer"].includes(m["bettedOn"])
                  ? { color: "purple" }
                  : {}
              }
            >
              {m["secondOdds"]}
            </span>
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
