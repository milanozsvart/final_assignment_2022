import { React, useContext, useRef } from "react";
import { CalculatorContext } from "./CalculatorContext";
import CalculatorFormAdditionalProps from "./CalculatorFormAdditionalProps";
import CalculatorResults from "./CalculatorResults";
import CalculatorNameFetcher from "./CalculatorNameFetcher";

export default function CalculatorForm() {
  const {
    calculationType,
    formState,
    setFormState,
    currentPlayerData,
    setCurrentPlayerData,
    playersReached,
    setPlayersReached,
  } = useContext(CalculatorContext);

  const playerNameRef = useRef();

  async function fetchPlayerData(playerName) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: playerName }),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/get_basic_player_data",
      requestOptions
    );
    const data = await response.json();
    setCurrentPlayerData(data);
  }

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

  const handleSubmitButton = (playerName) => {
    fetchPlayerData(playerName);
    let formStateToHandle = formState;
    setFormState(++formStateToHandle);
  };
  if (formState === 0) {
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
          <CalculatorNameFetcher handleSubmitButton={handleSubmitButton} />
          <div
            id="calculcator-submit-button"
            onClick={() => handleSubmitButton(playerNameRef.current.value)}
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
          <div id="calculcator-submit-button" onClick={handleSubmitButton}>
            submit
          </div>
        </div>
      );
    }
  } else if (formState === 1) {
    return <CalculatorFormAdditionalProps />;
  } else if (formState === 2) {
    return <CalculatorResults />;
  }
}
