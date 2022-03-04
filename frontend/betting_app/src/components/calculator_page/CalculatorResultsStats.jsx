import { React, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import CalculatorPerformanceStats from "./CalculatorPerformanceStats";
import CalculatorPlayerMatches from "./CalculatorPlayerMatches";

export default function CalculatorResultsStats(props) {
  const resultsRef = useRef(null);

  useEffect(() => {
    resultsRef.current.scrollIntoView({ behavior: "smooth" });
  });
  return (
    <div className="calculator-results" ref={resultsRef}>
      <div>
        <label>Perfromance against players:</label>
        <label id="label-info">
          Click the{" "}
          <FontAwesomeIcon icon={faCircleInfo} className="circle-info" /> icon
          on the labels to see the results of matches
        </label>
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
                />
              </div>
            );
          }
        )}
      </div>
      <CalculatorPlayerMatches />
    </div>
  );
}
