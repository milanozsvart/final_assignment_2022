import React, { useContext, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { MainContext } from "./MainContext";

export default function SelectedMatches(props) {
  const betNameRef = useRef();
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

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const saveBets = () => {
    if (bets.length < 1) {
      setErrorMessage("Please select matches to bet on!");
    } else {
      sendBetsData();
    }
  };

  async function sendBetsData() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        bets: bets,
        betsName: betNameRef.current.value,
      }),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/add_bet_to_user",
      requestOptions
    );
    if (response.ok) {
      const returnData = await response.json();
      setSuccess(true);
      setBets([]);
      setBetsLength(0);
      exit();
    } else {
      const returnData = await response.json();
      setErrorMessage(`Bet with name ${returnData["message"]} already exists!`);
      setSuccess(false);
    }
  }

  const removeFromBets = (id) => {
    let currentBets = bets;
    currentBets = currentBets.filter((el) => {
      return el["id"] !== id;
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
        <h1>Selected matches</h1>
        <h2>Select your matches on the Home page!</h2>
        <div id="bets-container">
          {bets.map((bet) => {
            return (
              <div className="bet-item">
                <span
                  style={
                    bet["pred"]["player"].includes(bet["firstPlayer"]) ||
                    bet["firstPlayer"].includes(bet["pred"]["player"])
                      ? selectedStyle
                      : { color: "cornflowerblue" }
                  }
                >
                  {bet["firstPlayer"]}
                </span>
                <span
                  style={
                    bet["pred"]["player"].includes(bet["secondPlayer"]) ||
                    bet["secondPlayer"].includes(bet["pred"]["player"])
                      ? selectedStyle
                      : { color: "cornflowerblue" }
                  }
                >
                  {bet["secondPlayer"]}
                </span>
                <span
                  style={
                    bet["pred"]["player"].includes(bet["firstPlayer"]) ||
                    bet["firstPlayer"].includes(bet["pred"]["player"])
                      ? selectedStyle
                      : { color: "cornflowerblue" }
                  }
                >
                  {bet["firstOdds"]}
                </span>
                <span
                  style={
                    bet["pred"]["player"].includes(bet["secondPlayer"]) ||
                    bet["secondPlayer"].includes(bet["pred"]["player"])
                      ? selectedStyle
                      : { color: "cornflowerblue" }
                  }
                >
                  {bet["secondOdds"]}
                </span>
                <span>
                  {(Math.min(bet["pred"]["points"], 0.999) * 100)
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
        <p
          id="selected-matches-error"
          style={success ? { visibility: "hidden" } : { visibility: "visible" }}
        >
          {errorMessage}
        </p>
        <input
          type="text"
          name=""
          id="insert-bet-name"
          placeholder="Add a name to your bet!"
          ref={betNameRef}
        />
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
