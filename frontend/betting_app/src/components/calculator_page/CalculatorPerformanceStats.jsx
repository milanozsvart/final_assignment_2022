import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function CalculatorPerformanceStats(props) {
  const opponentRanks = props.opponentRanks;
  const performanceBetweenRanks =
    props.currentPlayerData.performanceBetweenRanks;
  return (
    <>
      <FontAwesomeIcon
        icon={faCircleInfo}
        className="circle-info-player-stats"
      />
      <div className="performance-stats-ranks">
        {"Opponent's rank: " + opponentRanks}
      </div>
      <div className="performance-stats-section">
        {Object.keys(performanceBetweenRanks[opponentRanks]).map((label) => (
          <div className="perfromance-stats-individual">
            <div>{label}</div>
            <div>{performanceBetweenRanks[opponentRanks][label]}</div>
          </div>
        ))}
      </div>
    </>
  );
}
