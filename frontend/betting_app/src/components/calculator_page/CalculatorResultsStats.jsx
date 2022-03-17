import { React } from "react";
import CalculatorPlayerMatches from "./CalculatorPlayerMatches";
import CalculatorResultsRanks from "./CalculatorResultsRanks";

export default function CalculatorResultsStats(props) {
  return (
    <div className="calculator-results">
      <CalculatorResultsRanks currentPlayerData={props.currentPlayerData} />
      <CalculatorPlayerMatches />
    </div>
  );
}
