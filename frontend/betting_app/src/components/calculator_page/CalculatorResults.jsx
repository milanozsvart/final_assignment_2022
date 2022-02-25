import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";
import CalculatorCurrentPlayerCard from "./CalculatorCurrentPlayerCard";
import CalculatorResultsStats from "./CalculatorResultsStats";

export default function CalculatorResults() {
  const { currentPlayerData } = useContext(CalculatorContext);
  return (
    <div className="wrapper-calculator-results">
      <CalculatorCurrentPlayerCard currentPlayerData={currentPlayerData} />
      <CalculatorResultsStats currentPlayerData={currentPlayerData} />
    </div>
  );
}
