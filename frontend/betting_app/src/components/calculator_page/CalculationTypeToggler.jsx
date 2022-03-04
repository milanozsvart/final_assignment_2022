import { React, useContext, useRef } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculationTypeToggler(props) {
  const togglerStateRef = useRef();
  const {
    activeStyle,
    inactiveStyle,
    setFormState,
    setCalulationType,
    individualStyle,
    setIndividualStyle,
    compareStyle,
    setCompareStyle,
    setPlayersReached,
    setOpponentRanks,
    setCategorySelected,
  } = useContext(CalculatorContext);
  const handleCalculationType = (event) => {
    let propertyForChange = event.currentTarget.innerText.toLowerCase();
    let currentStateOfToggler = togglerStateRef.current.textContent;
    setCalulationType(propertyForChange);
    deinitializeState();
    if (currentStateOfToggler === propertyForChange) {
      activateIndividualToggler();
    } else {
      activateCompareToggler();
    }
  };

  const activateIndividualToggler = () => {
    setIndividualStyle(activeStyle);
    setCompareStyle(inactiveStyle);
  };

  const activateCompareToggler = () => {
    setIndividualStyle(inactiveStyle);
    setCompareStyle(activeStyle);
  };

  const deinitializeState = () => {
    setFormState(0);
    setPlayersReached([]);
    setOpponentRanks("");
    setCategorySelected("");
  };
  return (
    <div id="wrapper-calculator-individual-or-compare">
      <div
        id="wrapper-individual"
        className="wrapper-toggler"
        ref={togglerStateRef}
        style={individualStyle}
        onClick={handleCalculationType}
      >
        individual
      </div>
      <div
        id="wrapper-compare"
        className="wrapper-toggler"
        style={compareStyle}
        onClick={handleCalculationType}
      >
        compare
      </div>
    </div>
  );
}
