import React from "react";

export default function CalculatorCurrentPlayerCard(props) {
    console.log(props.currentPlayerData);
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
          <div id="all-matches" className="player-card-data-line">
            <div>Matches played: </div>
            <div>{props.currentPlayerData.allMatches}</div>
          </div>
          <div id="matches-won" className="player-card-data-line">
            <div>Matches won: </div>
            <div>{props.currentPlayerData.wonMatches}</div>
          </div>

          <label
            className="player-card-data-line"
            id="player-card-performance-label"
          >
            Best performance in tournaments:
          </label>
          {Object.keys(props.currentPlayerData.bestPerformance).map((key) => {
            return (
              <div className="player-card-data-line" key={key}>
                <div>{key + ": "}</div>
                <div>{props.currentPlayerData.bestPerformance[key]}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
}
