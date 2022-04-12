import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import CalculatorPerformanceStats from "./CalculatorPerformanceStats";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorResultsRanks(props) {
  const { calculationType } = useContext(CalculatorContext);
  return (
    <div>
      {Object.keys(props.currentPlayerData.performanceBetweenRanks).map(
        (opponentRanks) => {
          return (
            <>
              <span
                style={
                  calculationType === "compare"
                    ? { color: "cornflowerblue" }
                    : { display: "none" }
                }
              >
                {props.currentPlayerData.firstName +
                  " " +
                  props.currentPlayerData.surName}
              </span>
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
            </>
          );
        }
      )}
    </div>
  );
}
