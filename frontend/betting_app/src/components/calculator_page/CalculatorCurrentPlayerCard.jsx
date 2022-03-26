import React, { useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorCurrentPlayerCard(props) {
  const { additionalProps, setRanksResults, setRanksVisibility } =
    useContext(CalculatorContext);
  async function getHistoricRanksData() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: props.currentPlayerData.surName,
        additionalProps: additionalProps,
      }),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/get_historic_ranks_data",
      requestOptions
    );
    const data = await response.json();
    setRanksResults(data);
    setRanksVisibility(true);
  }
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
        <div id="player-rank" onClick={getHistoricRanksData}>
          {"#" + props.currentPlayerData.rank}
        </div>
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
