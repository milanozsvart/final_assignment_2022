import React, { useState } from "react";

export default function AddToBets(props) {
  const [bets, setBets] = useState(
    localStorage.getItem("bets") ? JSON.parse(localStorage.getItem("bets")) : []
  );
  const [text, setText] = useState(
    bets.filter((b) => b["id"] === props.match["id"]).length < 1
      ? "Add to bets"
      : "Remove from bets"
  );
  const [buttonClass, setButtonClass] = useState(
    bets.filter((b) => b["id"] === props.match["id"]).length < 1
      ? "bets-btn"
      : "remove-from-bets bets-btn"
  );
  const [predOutcome, setPredOutCome] = useState(
    props.match.result === props.match.pred.player
  );
  const handleText = () => {
    if (text === "Add to bets") {
      setText("Remove from bets");
      setButtonClass("remove-from-bets bets-btn");
      let currentBets = JSON.parse(localStorage.getItem("bets"));
      console.log(currentBets);
      currentBets.push(props.match);
      setBets(currentBets);
      localStorage.setItem("bets", JSON.stringify(currentBets));
    } else {
      setText("Add to bets");
      setButtonClass("bets-btn");
      let currentBets = JSON.parse(localStorage.getItem("bets"));
      console.log(currentBets);
      currentBets = currentBets.filter((el) => {
        return el["id"] != props.match["id"];
      });
      setBets(currentBets);
      localStorage.setItem("bets", JSON.stringify(currentBets));
    }
  };
  if (props.isToday) {
    return (
      <div className={buttonClass} onClick={handleText}>
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
