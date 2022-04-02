import React, { useState, useContext, useEffect } from "react";
import { MainContext } from "../MainContext";

export default function AddToBets(props) {
  const { bets, setBets, isOpen, token, setToken, betsLength, setBetsLength } =
    useContext(MainContext);

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
  const [predOutcome, setPredOutCome] = useState(
    props.match.result === props.match.pred.player
  );
  const handleText = () => {
    if (!token) {
      alert("If you want to add matches to your bets, please log in!");
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
          return el["id"] != props.match["id"];
        });
        setBets(currentBets);
        let length = betsLength;
        setBetsLength(--length);
      }
    }
  };
  if (props.isToday) {
    return (
      <div
        className={buttonClass}
        onClick={handleText}
        style={token ? {} : { opacity: "60%", cursor: "not-allowed" }}
      >
        {text}
      </div>
    );
  } else {
    return (
      <div className={predOutcome ? "bets-btn" : "remove-from-bets bets-btn"}>
        {predOutcome ? "Winner" : "Loser"}
      </div>
    );
  }
}
