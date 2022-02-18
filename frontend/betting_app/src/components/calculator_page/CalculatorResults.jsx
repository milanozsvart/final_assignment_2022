import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorResults() {
  const { currentPlayerData } = useContext(CalculatorContext);
  return (
    <div className="wrapper-calculator-results">
      <div className="wrapper-calculator-player-card">
        <div id="photo-container">
          <img
            src={currentPlayerData.flag}
            alt=""
            className="player-image"
          ></img>
        </div>
        <div className="wrapper-calculator-player-card-data">
          <div id="player-name">
            {currentPlayerData.firstName + " " + currentPlayerData.surName}
          </div>
          <div id="player-rank">{"#" + currentPlayerData.rank}</div>
        </div>
      </div>
      <div className="calculator-results">asd</div>
    </div>
  );
}
