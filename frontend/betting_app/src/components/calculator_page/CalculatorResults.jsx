import { React, useContext, useEffect, useRef } from "react";
import { CalculatorContext } from "./CalculatorContext";
import CalculatorCurrentPlayerCard from "./CalculatorCurrentPlayerCard";
import CalculatorResultsRanks from "./CalculatorResultsRanks";
import CalculatorResultsStats from "./CalculatorResultsStats";
import CalculatorPlayerMatches from "./CalculatorPlayerMatches";
import CalculatorResultsForm from "./CalculatorResultsForm";
import Predictions from "./Predictions";

export default function CalculatorResults() {
  const resultsRef = useRef();
  const { currentPlayerData, comparePlayerStats, calculationType } =
    useContext(CalculatorContext);
  useEffect(() => {
    resultsRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);
  if (calculationType === "individual") {
    return (
      <div className="wrapper-calculator-results" ref={resultsRef}>
        <CalculatorCurrentPlayerCard currentPlayerData={currentPlayerData} />
        <CalculatorResultsStats currentPlayerData={currentPlayerData} />
      </div>
    );
  } else if (calculationType === "compare") {
    return (
      <div
        className="wrapper-calculator-results"
        id="compare-results"
        ref={resultsRef}
      >
        <CalculatorCurrentPlayerCard
          currentPlayerData={comparePlayerStats[0]}
        />
        <div>
          <CalculatorResultsForm />
          <div id="compare-results-ranks" className="calculator-results">
            <CalculatorResultsRanks currentPlayerData={comparePlayerStats[0]} />
            <CalculatorResultsRanks currentPlayerData={comparePlayerStats[1]} />
          </div>
          <Predictions
            player={comparePlayerStats["pred"]["player"]}
            points={comparePlayerStats["pred"]["points"]}
          />
          <CalculatorPlayerMatches />
        </div>

        <CalculatorCurrentPlayerCard
          currentPlayerData={comparePlayerStats[1]}
        />
      </div>
    );
  } else {
    return null;
  }
}
