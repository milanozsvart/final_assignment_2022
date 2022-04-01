import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";

export default function Bets(props) {

  const selectedStyle = {
    fontSize: "1.5rem",
    //textDecoration: "underline",
    color: "purple",
    fontWeight: "bolder",
  };
  let [bets, setBets] = useState(
    localStorage.getItem("bets") ? JSON.parse(localStorage.getItem("bets")) : []
  );
  const exit = () => {
    props.setCurrentSetting(null);
  };

  const removeFromBets = (id) => {
    let currentBets = JSON.parse(localStorage.getItem("bets"));
    currentBets = currentBets.filter((el) => {
      return el["id"] != id;
    });
    setBets(currentBets);
    localStorage.setItem("bets", JSON.stringify(currentBets));
  };
  return (
    <>
      <div className="blurred-div"></div>
      <div className="bets-wrapper">
        <FontAwesomeIcon
          icon={faXmarkCircle}
          id="exit-btn-ranks"
          onClick={exit}
        />
        <h2>My bets</h2>
        <p>Select your matches on the Home page!</p>
        {bets.map((bet) => {
          return (
            <div className="bet-item">
              <span
                style={
                  bet["pred"]["player"] === bet["firstPlayer"]
                    ? selectedStyle
                    : { color: "cornflowerblue" }
                }
              >
                {bet["firstPlayer"]}
              </span>
              <span
                style={
                  bet["pred"]["player"] === bet["secondPlayer"]
                    ? selectedStyle
                    : { color: "cornflowerblue" }
                }
              >
                {bet["secondPlayer"]}
              </span>
              <span
                style={
                  bet["pred"]["player"] === bet["firstPlayer"]
                    ? selectedStyle
                    : { color: "cornflowerblue" }
                }
              >
                {bet["firstOdds"]}
              </span>
              <span
                style={
                  bet["pred"]["player"] === bet["secondPlayer"]
                    ? selectedStyle
                    : { color: "cornflowerblue" }
                }
              >
                {bet["secondOdds"]}
              </span>
              <span>{bet["pred"]["points"]}</span>
              <FontAwesomeIcon
                icon={faXmarkCircle}
                id="remove-match-from-bets"
                onClick={() => removeFromBets(bet["id"])}
              />
            </div>
          );
        })}
        <div id="save-button-bets">Save</div>
      </div>
    </>
  );
}
