import { React, useContext, useEffect, useRef } from "react";
import { CalculatorContext } from "./CalculatorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import CalculatorCurrentPlayerCard from "./CalculatorCurrentPlayerCard";
import CalculatorResultsRanks from "./CalculatorResultsRanks";
import CalculatorResultsStats from "./CalculatorResultsStats";
import CalculatorPlayerMatches from "./CalculatorPlayerMatches";
import CalculatorResultsForm from "./CalculatorResultsForm";
import Predictions from "./Predictions";
import Ranks from "../Ranks";

export default function CalculatorResults() {
  const resultsRef = useRef();
  const {
    currentPlayerData,
    comparePlayerStats,
    calculationType,
    ranksResults,
    ranksVisibility,
    setRanksVisibility,
  } = useContext(CalculatorContext);
  useEffect(() => {
    resultsRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);
  if (calculationType === "individual") {
    return (
      <div className="wrapper-calculator-results" ref={resultsRef}>
        <CalculatorCurrentPlayerCard currentPlayerData={currentPlayerData} />
        <CalculatorResultsStats currentPlayerData={currentPlayerData} />
        <Ranks
          ranks={ranksResults["ranks"]}
          dates={ranksResults["dates"]}
          player={ranksResults["player"]}
          visibility={ranksVisibility}
          setVisibility={setRanksVisibility}
        />
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
        <CalculatorCurrentPlayerCard
          currentPlayerData={comparePlayerStats[1]}
        />
        <div className="matches-data-wrapper">
          <Predictions
            player={comparePlayerStats["pred"]["player"]}
            points={comparePlayerStats["pred"]["points"]}
          />
          <CalculatorResultsForm />
          <div
            className="calculator-results"
            id="calculator-results-ranks-outer"
          >
            <label>Performance against players:</label>
            <label id="label-info">
              Click the{" "}
              <FontAwesomeIcon icon={faCircleInfo} className="circle-info" />{" "}
              icon on the labels to see the results of matches
            </label>
            <div id="compare-results-ranks" className="calculator-results">
              <CalculatorResultsRanks
                currentPlayerData={comparePlayerStats[0]}
              />
              <CalculatorResultsRanks
                currentPlayerData={comparePlayerStats[1]}
              />
            </div>
          </div>
        </div>
        <CalculatorPlayerMatches />

        <Ranks
          ranks={ranksResults["ranks"]}
          dates={ranksResults["dates"]}
          visibility={ranksVisibility}
          setVisibility={setRanksVisibility}
          player={ranksResults["player"]}
        />
      </div>
    );
  } else {
    return null;
  }
}
