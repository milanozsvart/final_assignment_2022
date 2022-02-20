import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorNameFetcher(props) {
  const { playersReached } = useContext(CalculatorContext);
  let players = playersReached;
  console.log(players);
  return (
    <div className="calculator-name-fetcher">
      {players.map((player) => (
        <div
          className="calculator-name-fetcher-player"
          key={player}
          onClick={() => props.handleSubmitButton(player)}
        >
          {player}
        </div>
      ))}
    </div>
  );
}
