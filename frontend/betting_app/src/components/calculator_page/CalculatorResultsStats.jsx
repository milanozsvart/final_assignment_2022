import { React } from "react";
import CalculatorPlayerMatches from "./CalculatorPlayerMatches";
import CalculatorResultsRanks from "./CalculatorResultsRanks";
import CalculatorResultsForm from "./CalculatorResultsForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function CalculatorResultsStats(props) {
  return (
    <div>
      <div className="calculator-results">
        <div>
          <label>Performance against players:</label>
          <label id="label-info">
            Click the{" "}
            <FontAwesomeIcon icon={faCircleInfo} className="circle-info" /> icon
            on the labels to see the results of matches
          </label>
        </div>
        <CalculatorResultsForm />
        <CalculatorResultsRanks currentPlayerData={props.currentPlayerData} />
        <CalculatorPlayerMatches />
      </div>
    </div>
  );
}
