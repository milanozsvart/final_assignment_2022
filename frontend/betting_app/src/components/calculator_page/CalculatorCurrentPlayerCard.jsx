import React from "react";

export default function CalculatorCurrentPlayerCard(props) {
  return (
    <div className="wrapper-calculator-player-card">
      <div id="photo-container">
        <img
          src={props.currentPlayerData.flag}
          alt=""
          className="player-image"
        ></img>
      </div>
      <div className="wrapper-calculator-player-card-data">
        <div id="player-name">
          {props.currentPlayerData.firstName +
            " " +
            props.currentPlayerData.surName}
        </div>
        <div id="player-rank">{"#" + props.currentPlayerData.rank}</div>
      </div>
    </div>
  );
}
