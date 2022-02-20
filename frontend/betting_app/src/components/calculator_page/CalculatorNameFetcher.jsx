import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorNameFetcher(props) {
  const { playersReached } = useContext(CalculatorContext);
  let players = playersReached;
  return (
    <div className="calculator-name-fetcher">
      {players.map((player) => (
        <div
          className="calculator-name-fetcher-player"
          key={player.split(",")[0].trim()}
          onClick={() => props.handleSubmitButton(player.split(",")[0].trim())}
        >
          {player}
        </div>
      ))}
    </div>
  );
}
