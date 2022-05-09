import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function MatchesBetted(props) {
  let odds = 1;
  console.log(props.matches);
  const calculateIcon = (match) => {
    if (match["result"] === null) {
      return faQuestionCircle;
    } else if (match["result"] !== match["bettedOn"]) {
      return faXmark;
    } else {
      return faCheck;
    }
  };
  const calculateStyle = (match) => {
    if (match["result"] === null) {
      return { backgroundColor: "lightyellow", color: "grey" };
    } else if (match["result"] !== match["bettedOn"]) {
      return { backgroundColor: "red", color: "rgb(86, 0, 0)" };
    } else {
      return { backgroundColor: "greenyellow", color: "darkgreen" };
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
                  ? {
                      borderBottom: "2px solid black",
                    }
                  : {}
              }
            >
              {m["firstPlayer"]}
            </span>
            <span
              style={
                m["bettedOn"].includes(m["secondPlayer"]) ||
                m["secondPlayer"].includes(m["bettedOn"])
                  ? { borderBottom: "2px solid black" }
                  : {}
              }
            >
              {m["secondPlayer"]}
            </span>
            <span
              style={
                m["bettedOn"].includes(m["firstPlayer"]) ||
                m["firstPlayer"].includes(m["bettedOn"])
                  ? { borderBottom: "2px solid black" }
                  : {}
              }
            >
              {m["firstOdds"]}
            </span>
            <span
              style={
                m["bettedOn"].includes(m["secondPlayer"]) ||
                m["secondPlayer"].includes(m["bettedOn"])
                  ? { borderBottom: "2px solid black" }
                  : {}
              }
            >
              {m["secondOdds"]}
            </span>
            <FontAwesomeIcon icon={calculateIcon(m)} />
          </div>
        );
      })}
      <span className="odds-span">Odds: {odds.toFixed(3)}</span>
    </div>
  );
}
