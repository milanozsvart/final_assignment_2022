import React, { useEffect, useState } from "react";

export default function Predictions(props) {
  const player = props.player;
  const points = parseFloat(props.points);
  const blue = 0;

  let percentage = Math.min(points / 4000 + 0.5, 1) * 100;
  console.log(percentage);
  useEffect(() => {
    const predWrappers = document.querySelectorAll(".prediction-wrapper");
    predWrappers.forEach((wrapper) => {
      const certainityDivs = wrapper.querySelectorAll(".certainity-div");
      let red = 0;
      let green = 0;
      certainityDivs.forEach((div) => {
        let idRange = div.id.split("-");
        let start = parseInt(idRange[0]);
        let end = parseInt(idRange[1]);
        if (end < percentage) {
          div.classList.add("fixed");
        } else if (end >= percentage && start < percentage) {
          div.classList.add("fixed");
        }
        if (percentage > 49 && percentage < 71) {
          red = 255;
          green = 155 + (percentage - 50) * 5;
        } else if (percentage > 71 && percentage < 101) {
          red = 255 - (percentage - 71) * 3;
          green = 255;
        }
      });

      const fixedDivs = wrapper.querySelectorAll(".fixed");
      fixedDivs.forEach((div) => {
        div.style.backgroundColor = `rgba(${red}, ${green}, 0)`;
      });
    });
  }, []);

  return (
    <div className="prediction-wrapper" key={player}>
      <p>Prediction to win match: {player}</p>
      <p>Certainity: </p>
      <div className="certainity-wrapper">
        <div className="certainity-div fixed" id="0-10"></div>
        <div className="certainity-div fixed" id="11-20"></div>
        <div className="certainity-div fixed" id="21-30"></div>
        <div className="certainity-div fixed" id="31-40"></div>
        <div className="certainity-div fixed" id="41-50"></div>
        <div className="certainity-div" id="51-60"></div>
        <div className="certainity-div" id="61-70"></div>
        <div className="certainity-div" id="71-80"></div>
        <div className="certainity-div" id="81-90"></div>
        <div className="certainity-div" id="91-100"></div>
      </div>
    </div>
  );
}
