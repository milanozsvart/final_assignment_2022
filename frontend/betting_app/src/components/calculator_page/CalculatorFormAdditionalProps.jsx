import { React, useContext, useState } from "react";
import CalculatorFormSelect from "./CalculatorFormSelect";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorFormAdditionalProps(props) {
  const selectProperties = [
    { name: "court", values: ["all", "hard", "clay", "grass"] },
    {
      name: "tournament",
      values: ["All", "Grand Slam", "WTA1000", "WTA500", "WTA250", "WTA125"],
    },
    {
      name: "round",
      values: ["All", "Quarterfinals", "Semifinals", "The Final", "Other"],
    },
  ];

  const addMonths = (date, months) => {
    let month = (date.getMonth() + months) % 12;
    //create a new Date object that gets the last day of the desired month
    let last = new Date(date.getFullYear(), month + 1, 0);

    //compare dates and set appropriately
    if (date.getDate() <= last.getDate()) {
      date.setMonth(month);
    } else {
      date.setMonth(month, last.getDate());
    }

    return date;
  };

  const [dateValue, setDateValue] = useState(addMonths(new Date(), -6));

  const { setAdditionalProps } = useContext(CalculatorContext);

  const handleSubmitButton = () => {
    let data = {};
    const nodes = document.querySelectorAll(".wrapper-calculator-form-inner");
    for (let i = 0; i < nodes.length; i++) {
      let select = nodes[i].querySelector("select");
      let label = nodes[i].querySelector("label").innerText;
      if (select) {
        let options = select.querySelectorAll("option");
        for (let j = 0; j < options.length; j++) {
          if (options[j].selected) {
            data[label.toLowerCase()] = options[j].value;
          }
        }
      } else {
        let dateValue = nodes[i].querySelector("input").value;
        data[label.toLowerCase().replace(" ", "")] = dateValue;
      }
    }
    setAdditionalProps(data);
    props.fetchPlayerData(data);
  };
  return (
    <>
      <div className="wrapper-calculator-form-properties">
        {selectProperties.map((selectProperty) => (
          <CalculatorFormSelect
            selectProperty={selectProperty}
            selectPropertyValues={selectProperty.values}
            key={selectProperty.name}
          />
        ))}
        <div className="wrapper-calculator-form-inner">
          <label>Start date</label>
          <input
            type="date"
            min="2021-01-06"
            max={new Date().toISOString().split("T")[0]}
            value={dateValue.toISOString().split("T")[0]}
            onChange={(e) => setDateValue(e.currentTarget.value)}
          />
        </div>
      </div>
      <div id="calculcator-submit-button" onClick={handleSubmitButton}>
        submit
      </div>
    </>
  );
}
