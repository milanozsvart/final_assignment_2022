import { React } from "react";
import CalculatorPlayerMatches from "./CalculatorPlayerMatches";
import CalculatorResultsRanks from "./CalculatorResultsRanks";
import CalculatorResultsForm from "./CalculatorResultsForm";

export default function CalculatorResultsStats(props) {
  return (
    <div>
      <CalculatorResultsForm />
      <div className="calculator-results">
        <CalculatorResultsRanks currentPlayerData={props.currentPlayerData} />
        <CalculatorPlayerMatches />
      </div>
    </div>
  );
}
