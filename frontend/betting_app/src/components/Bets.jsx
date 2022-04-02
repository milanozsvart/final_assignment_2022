import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { MainContext } from "./MainContext";

export default function Bets(props) {
  const selectedStyle = {
    fontSize: "1.5rem",
    //textDecoration: "underline",
    color: "purple",
    fontWeight: "bolder",
  };
  const { bets, setBets, setIsOpen, betsLength, setBetsLength } =
    useContext(MainContext);
  const exit = () => {
    props.setCurrentSetting(null);
    setIsOpen(false);
  };

  const saveBets = () => {
    if (bets.length < 1) {
      alert("Please select matches to bet on!");
    } else {
      sendBetsData();
      setBets([]);
      setBetsLength(0);
      exit();
    }
  };

  async function sendBetsData() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        bets: bets,
      }),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/add_bet_to_user",
      requestOptions
    );
    const returnData = await response.json();
  }

  const removeFromBets = (id) => {
    let currentBets = bets;
    currentBets = currentBets.filter((el) => {
      return el["id"] != id;
    });
    setBets(currentBets);
    let length = betsLength;
    setBetsLength(--length);
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
        <div id="bets-container">
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
                <span>
                  {(Math.min(bet["pred"]["points"] / 1000 + 0.5, 0.999) * 100)
                    .toString()
                    .substring(0, 4)}
                  {"%"}
                </span>
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  id="remove-match-from-bets"
                  onClick={() => removeFromBets(bet["id"])}
                />
              </div>
            );
          })}
        </div>
        <div
          id="save-button-bets"
          onClick={saveBets}
          style={
            bets.length < 1 ? { opacity: "60%", cursor: "not-allowed" } : {}
          }
        >
          Save
        </div>
      </div>
    </>
  );
}
