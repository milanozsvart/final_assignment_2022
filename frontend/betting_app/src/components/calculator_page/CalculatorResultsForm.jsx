import React, { useContext, useState } from "react";
import CalculatorResultsSelect from "./CalculatorResultsSelect";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorResultsForm() {
  const {
    additionalProps,
    setAdditionalProps,
    player,
    setComparePlayerStats,
    setCurrentPlayerData,
  } = useContext(CalculatorContext);
  const [dateValue, setDateValue] = useState(additionalProps["startdate"]);
  async function fetchPlayerData() {
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
    if (Array.isArray(player)) {
      setComparePlayerStats(data);
    } else {
      setCurrentPlayerData(data);
    }
  }
  const selectProperties = [
    {
      name: "court",
      values: ["all", "hard", "clay", "grass"],
      selected: "hard",
    },
    {
      name: "tournament",
      values: ["All", "Grand Slam", "WTA1000", "WTA500", "WTA250", "WTA125"],
      selected: "Grand Slam",
    },
    {
      name: "round",
      values: ["All", "Quarterfinals", "Semifinals", "The Final", "Other"],
      selected: "Other",
    },
  ];

  return (
    <div className="calculator-results-form">
      {selectProperties.map((selectProperty) => (
        <CalculatorResultsSelect
          selectProperty={selectProperty}
          selectPropertyValues={selectProperty.values}
          key={selectProperty.name}
          fetchPlayerData={fetchPlayerData}
        />
      ))}
      <div className="calculator-results-form-inner">
        <label>Start date</label>
        <input
          type="date"
          min="2021-01-06"
          max={new Date().toISOString().split("T")[0]}
          value={dateValue}
          onChange={(e) => {
            setDateValue(e.currentTarget.value);
            let tempAdditionalProps = additionalProps;
            tempAdditionalProps["startdate"] = e.currentTarget.value;
            setAdditionalProps(tempAdditionalProps);
            fetchPlayerData();
          }}
        />
      </div>
    </div>
  );
}
