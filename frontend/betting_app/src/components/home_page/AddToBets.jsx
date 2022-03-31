import React, { useState } from "react";

export default function AddToBets(props) {
  const [text, setText] = useState("Add to bets");
  const [buttonClass, setButtonClass] = useState("bets-btn");
  const [bets, setBets] = useState([]);
  const handleText = () => {
    if (text === "Add to bets") {
      setText("Remove from bets");
      setButtonClass("remove-from-bets bets-btn");
      let currentBets = bets;
      currentBets.push(props.match);
      setBets(currentBets);
    } else {
      setText("Add to bets");
      setButtonClass("bets-btn");
      let currentBets = bets;
      currentBets = currentBets.filter((el) => {
        return el["id"] != props.match["id"];
      });
      setBets(currentBets);
    }
  };
  return (
    <div className={buttonClass} onClick={handleText}>
      {text}
    </div>
  );
}
