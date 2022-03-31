import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";

export default function Bets(props) {
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
        {bets.map((bet) => {
          return (
            <div className="bet-item">
              <span>{bet["firstPlayer"]}</span>
              <span>{bet["secondPlayer"]}</span>
              <span>{bet["firstOdds"]}</span>
              <span>{bet["secondOdds"]}</span>
              <FontAwesomeIcon
                icon={faXmarkCircle}
                id="remove-match-from-bets"
                onClick={() => removeFromBets(bet["id"])}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
