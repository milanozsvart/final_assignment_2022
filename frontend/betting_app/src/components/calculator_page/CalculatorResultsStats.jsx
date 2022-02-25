import { React, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function CalculatorResultsStats(props) {
  const resultsRef = useRef(null);

  useEffect(() => {
    resultsRef.current.scrollIntoView({ behavior: "smooth" });
  });
  return (
    <div className="calculator-results" ref={resultsRef}>
      <label>Perfromance against players:</label>
      <label id="label-info">
        Click the{" "}
        <FontAwesomeIcon icon={faCircleInfo} className="circle-info" /> icon on
        the labels to see the results of matches
      </label>
      {Object.keys(props.currentPlayerData.performanceBetweenRanks).map(
        (opponentRanks) => {
          return (
            <div className="performance-stats">
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="circle-info-player-stats"
              />
              <div className="performance-stats-ranks">
                {"Opponent's rank: " + opponentRanks}
              </div>
              <div className="performance-stats-section">
                {Object.keys(
                  props.currentPlayerData.performanceBetweenRanks[opponentRanks]
                ).map((data) => (
                  <div className="perfromance-stats-individual">
                    <div>{data}</div>
                    <div>
                      {
                        props.currentPlayerData.performanceBetweenRanks[
                          opponentRanks
                        ][data]
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}
