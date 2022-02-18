import { React, useContext } from "react";
import CalculatorFormSelect from "./CalculatorFormSelect";
import { CalculatorContext } from "./CalculatorContext";

export default function CalculatorFormAdditionalProps() {
  const selectProperties = [
    { name: "court", values: ["all", "hard", "clay", "grass"] },
    {
      name: "tournament",
      values: ["all", "grand slam", "w1000", "w500", "w250", "w125"],
    },
    {
      name: "round",
      values: ["all", "quarterfinal", "semifinal", "final", "other"],
    },
  ];

  const { formState, setFormState } = useContext(CalculatorContext);

  const handleSubmitButton = () => {
    let formStateToHandle = formState;
    setFormState(++formStateToHandle);
  };
  return (
    <>
      <div className="wrapper-calculator-form-properties">
        {selectProperties.map((selectProperty) => (
          <CalculatorFormSelect
            selectProperty={selectProperty}
            selectPropertyValues={selectProperty.values}
          />
        ))}
      </div>
      <div id="calculcator-submit-button" onClick={handleSubmitButton}>
        submit
      </div>
    </>
  );
}
