import React, { useContext } from "react";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorResultsSelect(props) {
  const { additionalProps, setAdditionalProps } = useContext(CalculatorContext);

  return (
    <div className="calculator-results-form-inner">
      <label>{props.selectProperty.name}</label>
      <select
        onClick={(e) => {
          let tempAdditionalProps = additionalProps;
          tempAdditionalProps[props.selectProperty.name] =
            e.currentTarget.value;
          setAdditionalProps(tempAdditionalProps);
          props.fetchPlayerData();
        }}
      >
        {props.selectPropertyValues.map((selectPropertyValue) => (
          <option
            value={selectPropertyValue}
            key={props.selectProperty.name + "_" + selectPropertyValue}
            selected={
              additionalProps[props.selectProperty.name] === selectPropertyValue
            }
          >
            {selectPropertyValue}
          </option>
        ))}
      </select>
    </div>
  );
}
