import { React, useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";
import CalculatorCurrentPlayerCard from "./CalculatorCurrentPlayerCard";

export default function CalculatorResults() {
  const { currentPlayerData } = useContext(CalculatorContext);
  return (
    <div className="wrapper-calculator-results">
      <CalculatorCurrentPlayerCard currentPlayerData={currentPlayerData} />
      <div className="calculator-results">asd</div>
    </div>
  );
}
