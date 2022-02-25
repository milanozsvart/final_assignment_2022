import { React, useContext, useRef } from "react";
import CalculatorNameFetcher from "./CalculatorNameFetcher";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorPlayerInput(props) {
  const { calculationType, setPlayersReached } = useContext(CalculatorContext);

  const playerNameRef = useRef();

  async function fetchReachedPlayers() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partOfPlayerName: playerNameRef.current.value }),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/get_reached_players",
      requestOptions
    );
    const data = await response.json();
    setPlayersReached(data["values"]);
  }

  if (calculationType === "individual") {
    return (
      <div className="wrapper-calculator-form">
        <input
          type="text"
          name=""
          id="player-name-text-input"
          placeholder="Enter player name..."
          spellCheck={false}
          ref={playerNameRef}
          onChange={fetchReachedPlayers}
        />
        <CalculatorNameFetcher handleSubmitButton={props.handleSubmitButton} />
        <div
          id="calculcator-submit-button"
          onClick={() => props.handleSubmitButton(playerNameRef.current.value)}
        >
          submit
        </div>
      </div>
    );
  } else {
    return (
      <div className="wrapper-calculator-form">
        <input
          type="text"
          name=""
          id="player-name-text-input"
          placeholder="First player name..."
          spellCheck={false}
        />
        <input
          type="text"
          name=""
          id="player-name-text-input"
          placeholder="Second player name..."
          spellCheck={false}
        />
        <div id="calculcator-submit-button" onClick={props.handleSubmitButton}>
          submit
        </div>
      </div>
    );
  }
}
