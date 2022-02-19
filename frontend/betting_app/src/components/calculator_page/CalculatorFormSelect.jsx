import React from "react";

export default function CalculatorFormSelect(props) {
  return (
    <div className="wrapper-calculator-form-inner">
      <label>{props.selectProperty.name}</label>
      <select>
        {props.selectPropertyValues.map((selectPropertyValue) => (
          <option
            value={selectPropertyValue}
            key={props.selectProperty.name + "_" + selectPropertyValue}
          >
            {selectPropertyValue}
          </option>
        ))}
      </select>
    </div>
  );
}
