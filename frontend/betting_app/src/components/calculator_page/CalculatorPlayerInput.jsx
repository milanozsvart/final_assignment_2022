import { React, useContext, useRef, useState } from "react";
import CalculatorNameFetcher from "./CalculatorNameFetcher";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorPlayerInput(props) {
  const [currentInput, setCurrentInput] = useState();
  const { calculationType, setPlayersReached, setPlayer } =
    useContext(CalculatorContext);

  const playerNameRef = useRef();

  const player1Ref = useRef();
  const player2Ref = useRef();

  async function fetchReachedPlayers(whichRef) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partOfPlayerName: whichRef.current.value }),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/get_reached_players",
      requestOptions
    );
    const data = await response.json();
    setPlayersReached(data["values"]);
    handleCurrentInput(whichRef);
  }

  const handleNameSelection = (currentRef, playerName) => {
    if (currentRef === "player1") {
      player1Ref.current.value = playerName;
    } else if (currentRef === "player2") {
      player2Ref.current.value = playerName;
    }
    setCurrentInput(null);
  };

  const handleCurrentInput = (whichRef) => {
    if (whichRef === playerNameRef) {
      setCurrentInput("purePlayer");
    } else if (whichRef === player1Ref) {
      setCurrentInput("player1");
    } else if (whichRef === player2Ref) {
      setCurrentInput("player2");
    }
  };

  if (calculationType === "individual") {
    return (
      <div className="wrapper-calculator-form">
        <div className="calculator-player-input">
          <input
            type="text"
            name=""
            id="player-name-text-input"
            placeholder="Enter player name..."
            spellCheck={false}
            ref={playerNameRef}
            onChange={() => fetchReachedPlayers(playerNameRef)}
          />
          <CalculatorNameFetcher
            handleSubmitButton={props.handleSubmitButton}
            currentRef={"purePlayer"}
            currentInput={currentInput}
          />
        </div>
        <div
          id="calculcator-submit-button"
          onClick={() => {
            setPlayer(playerNameRef.current.value);
            props.handleSubmitButton();
          }}
        >
          submit
        </div>
      </div>
    );
  } else {
    return (
      <div className="wrapper-calculator-form">
        <div className="calculator-player-input">
          <input
            type="text"
            name="player1-name-text-input"
            id="player-name-text-input"
            placeholder="First player name..."
            spellCheck={false}
            ref={player1Ref}
            onChange={() => fetchReachedPlayers(player1Ref)}
          />
          <CalculatorNameFetcher
            currentRef={"player1"}
            currentInput={currentInput}
            handleSubmitButton={handleNameSelection}
          />
        </div>
        <div className="calculator-player-input">
          <input
            type="text"
            name="player2-name-text-input"
            id="player-name-text-input"
            placeholder="Second player name..."
            spellCheck={false}
            ref={player2Ref}
            onChange={() => fetchReachedPlayers(player2Ref)}
          />
          <CalculatorNameFetcher
            currentRef={"player2"}
            currentInput={currentInput}
            handleSubmitButton={handleNameSelection}
          />
        </div>
        <div
          id="calculcator-submit-button"
          onClick={() => {
            setPlayer([
              player1Ref.current.value.split(",")[0].trim(),
              player2Ref.current.value.split(",")[0].trim(),
            ]);
            props.handleSubmitButton();
          }}
        >
          submit
        </div>
      </div>
    );
  }
}
