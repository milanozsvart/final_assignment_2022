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
  const [playerMatches, setPlayerMatches] = useState([]);
  const [opponentRanks, setOpponentRanks] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [comparePlayerStats, setComparePlayerStats] = useState([]);
  const [player, setPlayer] = useState();
  const [additionalProps, setAdditionalProps] = useState();
  const [ranksResults, setRanksResults] = useState({ ranks: [], dates: [] });
  const [ranksVisibility, setRanksVisibility] = useState(false);
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
        playerMatches,
        setPlayerMatches,
        opponentRanks,
        setOpponentRanks,
        categorySelected,
        setCategorySelected,
        comparePlayerStats,
        setComparePlayerStats,
        player,
        setPlayer,
        additionalProps,
        setAdditionalProps,
        ranksResults,
        setRanksResults,
        ranksVisibility,
        setRanksVisibility,
      }}
    >
      {props.children}
    </CalculatorContext.Provider>
  );
}
