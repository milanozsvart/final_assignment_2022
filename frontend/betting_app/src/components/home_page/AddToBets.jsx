import React, { useState, useContext, useEffect } from "react";
import ErrorHandler from "../calculator_page/ErrorHandler";
import { MainContext } from "../MainContext";

export default function AddToBets(props) {
  const { bets, setBets, isOpen, token, betsLength, setBetsLength } =
    useContext(MainContext);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setText(
      bets.filter((b) => b["id"] === props.match["id"]).length < 1
        ? "Add to bets"
        : "Remove from bets"
    );
    setButtonClass(
      bets.filter((b) => b["id"] === props.match["id"]).length < 1
        ? "bets-btn"
        : "remove-from-bets bets-btn"
    );
  }, [isOpen]);
  const [text, setText] = useState("Add to bets");
  const [buttonClass, setButtonClass] = useState("bets-btn");
  const predOutcome = props.match.result === props.match.pred.player;

  const handleText = () => {
    if (!token) {
      setErrorMessage("Please LOG IN! Match cannot be added!");
    } else {
      if (text === "Add to bets") {
        setText("Remove from bets");
        setButtonClass("remove-from-bets bets-btn");
        let currentBets = bets;
        currentBets.push(props.match);
        setBets(currentBets);
        let length = betsLength;
        setBetsLength(++length);
      } else {
        setText("Add to bets");
        setButtonClass("bets-btn");
        let currentBets = bets;
        currentBets = currentBets.filter((el) => {
          return el["id"] !== props.match["id"];
        });
        setBets(currentBets);
        let length = betsLength;
        setBetsLength(--length);
      }
    }
  };
  if (!props.match["result"]) {
    return (
      <>
        <ErrorHandler message={errorMessage} setMessage={setErrorMessage} />
        <div
          className={buttonClass}
          onClick={handleText}
          style={token ? {} : { opacity: "60%", cursor: "not-allowed" }}
        >
          {text}
        </div>
      </>
    );
  } else {
    return (
      <>
        <ErrorHandler message={errorMessage} setMessage={setErrorMessage} />
        <div className={predOutcome ? "bets-btn" : "remove-from-bets bets-btn"}>
          {predOutcome ? "Winner" : "Loser"}
        </div>
      </>
    );
  }
}
