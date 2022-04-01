import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import CalculatorPerformanceStats from "./CalculatorPerformanceStats";

export default function CalculatorResultsRanks(props) {
  return (
    <div>
      {Object.keys(props.currentPlayerData.performanceBetweenRanks).map(
        (opponentRanks) => {
          return (
            <div
              className="performance-stats"
              key={opponentRanks + "-performance-stats"}
            >
              <CalculatorPerformanceStats
                performanceBetweenRanks={
                  props.currentPlayerData.performanceBetweenRanks
                }
                opponentRanks={opponentRanks}
                surName={props.currentPlayerData.surName}
              />
            </div>
          );
        }
      )}
    </div>
  );
}
