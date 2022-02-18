import { React, useState, createContext } from "react";

export const CalculatorContext = createContext();

export function CalculatorState(props) {
  const activeStyle = {
    backgroundColor: "cornflowerblue",
    color: "white",
  };

  const inactiveStyle = {
    backgroundColor: "white",
    color: "cornflowerblue",
  };

  const [calculationType, setCalulationType] = useState("individual");
  const [individualStyle, setIndividualStyle] = useState(activeStyle);
  const [compareStyle, setCompareStyle] = useState(inactiveStyle);
  const [formState, setFormState] = useState(0);
  const [currentPlayerData, setCurrentPlayerData] = useState({});
  const [playersReached, setPlayersReached] = useState([]);
  return (
    <CalculatorContext.Provider
      value={{
        activeStyle,
        inactiveStyle,
        calculationType,
        setCalulationType,
        individualStyle,
        setIndividualStyle,
        compareStyle,
        setCompareStyle,
        formState,
        setFormState,
        currentPlayerData,
        setCurrentPlayerData,
        playersReached,
        setPlayersReached,
      }}
    >
      {props.children}
    </CalculatorContext.Provider>
  );
}
