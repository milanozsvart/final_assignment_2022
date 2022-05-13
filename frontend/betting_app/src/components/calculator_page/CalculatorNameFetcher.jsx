import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorNameFetcher(props) {
  const { playersReached, setPlayer } = useContext(CalculatorContext);
  let players = playersReached;
  if (
    props.currentRef === props.currentInput &&
    props.currentInput === "purePlayer"
  ) {
    return (
      <div className="calculator-name-fetcher">
        {players.map((player) => (
          <div
            className="calculator-name-fetcher-player"
            key={player}
            onClick={() => {
              setPlayer(player.split(",")[0].trim());
              props.handleSubmitButton();
            }}
          >
            {player}
          </div>
        ))}
      </div>
    );
  } else if (props.currentRef === props.currentInput) {
    return (
      <div className="calculator-name-fetcher">
        {players.map((player) => (
          <div
            className="calculator-name-fetcher-player"
            key={player.split(",")[0].trim()}
            onClick={() => props.handleSubmitButton(props.currentRef, player)}
          >
            {player}
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}
