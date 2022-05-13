import { React, useContext, useState } from "react";
import { CalculatorContext } from "./CalculatorContext";
import CalculatorFormAdditionalProps from "./CalculatorFormAdditionalProps";
import CalculatorResults from "./CalculatorResults";
import CalculatorPlayerInput from "./CalculatorPlayerInput";
import ErrorHandler from "./ErrorHandler";

export default function CalculatorForm() {
  const {
    formState,
    setFormState,
    setCurrentPlayerData,
    setComparePlayerStats,
    player,
  } = useContext(CalculatorContext);

  const [errorMessage, setErrorMessage] = useState("");

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
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(player)) {
        setComparePlayerStats(data);
      } else {
        setCurrentPlayerData(data);
      }
      handleSubmitButton();
    } else {
      const data = await response.json();
      setErrorMessage(data["message"]);
      setFormState(0);
    }
  }

  const handleSubmitButton = () => {
    let formStateToHandle = formState;
    setFormState(++formStateToHandle);
  };
  if (formState === 0) {
    return (
      <>
        <ErrorHandler message={errorMessage} setMessage={setErrorMessage} />
        <CalculatorPlayerInput handleSubmitButton={handleSubmitButton} />
      </>
    );
  } else if (formState === 1) {
    return <CalculatorFormAdditionalProps fetchPlayerData={fetchPlayerData} />;
  } else if (formState === 2) {
    return <CalculatorResults />;
  }
}
