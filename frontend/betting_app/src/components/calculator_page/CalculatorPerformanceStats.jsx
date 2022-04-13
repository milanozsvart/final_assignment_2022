import { React, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { CalculatorContext } from "./CalculatorContext";
import { Textfit } from "react-textfit";

export default function CalculatorPerformanceStats(props) {
  const {
    setPlayerMatches,
    setOpponentRanks,
    setCategorySelected,
    additionalProps,
    setSelectedPlayer,
  } = useContext(CalculatorContext);
  const opponentRanks = props.opponentRanks;
  const performanceBetweenRanks = props.performanceBetweenRanks;

  const [visibility, setVisibility] = useState(0);
  const [visibilityStyle, setVisibilityStyle] = useState({
    opacity: 0,
    visibility: "hidden",
  });

  const handleVisibility = () => {
    if (visibility === 1) {
      setVisibility(0);
      setVisibilityStyle({ opacity: 0, visibility: "hidden" });
    } else {
      setVisibility(1);
      setVisibilityStyle({ opacity: 1, visibility: "visible" });
    }
  };

  async function fetchPlayerMatches(event) {
    handleVisibility();
    setOpponentRanks(opponentRanks);
    setCategorySelected(event.currentTarget.textContent);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: props.surName,
        opponentRanks: opponentRanks,
        category: event.currentTarget.id,
        additionalProps: additionalProps,
      }),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/get_matches_data",
      requestOptions
    );
    let data = await response.text();
    data = data.replaceAll("Tour Championships", "Tour Ch.");
    setPlayerMatches(JSON.parse(data));
    setSelectedPlayer(props.surName);
    document
      .querySelector("#calculator-player-matches-wrapper")
      .scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <FontAwesomeIcon
        icon={faCircleInfo}
        className="circle-info-player-stats"
        onClick={handleVisibility}
      />
      <div className="get-player-matches" style={visibilityStyle}>
        <p onClick={fetchPlayerMatches} id="all">
          All matches
        </p>
        <p onClick={fetchPlayerMatches} id="won">
          Matches won
        </p>
        <p onClick={fetchPlayerMatches} id="won-2-0">
          Matches won 2-0
        </p>
        <p onClick={fetchPlayerMatches} id="lost">
          Matches lost
        </p>
      </div>
      <Textfit mode="single" max={16} className="performance-stats-ranks">
        {"Opponent's rank: " + opponentRanks}
      </Textfit>
      <div className="performance-stats-section">
        {Object.keys(performanceBetweenRanks[opponentRanks]).map((label) => (
          <div
            className="perfromance-stats-individual"
            key={label + "performance-stats-individual"}
            id={label}
          >
            <div>{label}</div>
            <div id={label.replaceAll(" ", "") + "_count"}>
              {performanceBetweenRanks[opponentRanks][label]}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
