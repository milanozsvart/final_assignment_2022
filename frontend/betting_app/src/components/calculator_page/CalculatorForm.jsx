import { React, useContext, useEffect } from "react";
import { CalculatorContext } from "./CalculatorContext";
import CalculatorFormAdditionalProps from "./CalculatorFormAdditionalProps";
import CalculatorResults from "./CalculatorResults";
import CalculatorPlayerInput from "./CalculatorPlayerInput";

export default function CalculatorForm() {
  const {
    formState,
    setFormState,
    setCurrentPlayerData,
    setComparePlayerStats,
    player,
  } = useContext(CalculatorContext);

  async function fetchPlayerData(additionalProps) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: player,
        additionalProps: additionalProps,
      }),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/get_basic_player_data",
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (Array.isArray(player)) {
      setComparePlayerStats(data);
    } else {
      setCurrentPlayerData(data);
    }
    handleSubmitButton();
  }

  const handleSubmitButton = () => {
    let formStateToHandle = formState;
    setFormState(++formStateToHandle);
  };
  if (formState === 0) {
    return <CalculatorPlayerInput handleSubmitButton={handleSubmitButton} />;
  } else if (formState === 1) {
    return <CalculatorFormAdditionalProps fetchPlayerData={fetchPlayerData} />;
  } else if (formState === 2) {
    return <CalculatorResults />;
  }
}
