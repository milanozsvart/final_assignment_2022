import React, { useEffect, useState } from "react";

export default function Predictions(props) {
  const player = props.player;
  const points = parseFloat(props.points);

  let percentage = Math.min(points / 4000 + 0.5, 1) * 100;
  const certainities = getCertainities(percentage);

  return (
    <div className="prediction-wrapper" key={player}>
      <p>Prediction to win match: {player}</p>
      <p>Certainity: </p>
      <div className="certainity-wrapper">
        {certainities.map((cert) => {
          return (
            <div
              style={{ backgroundColor: cert["color"] }}
              className={
                cert["fixed"] ? "certainity-div fixed" : "certainity-div"
              }
            ></div>
          );
        })}
      </div>
    </div>
  );
}

const getCertainities = (percentage) => {
  let certs = [];
  for (let i = 0; i < 10; i++) {
    const start = i * 10 + 1;
    const end = i * 10 + 10;
    let cert = { fixed: false, color: "" };
    let red, green;
    if (end < percentage) {
      cert["fixed"] = true;
    } else if (end >= percentage && start < percentage) {
      cert["fixed"] = true;
    }

    if (percentage > 49 && percentage < 71) {
      red = 255;
      green = 155 + (percentage - 50) * 5;
    } else if (percentage > 71 && percentage < 101) {
      red = 255 - (percentage - 71) * 3;
      green = 255;
    }

    if (cert["fixed"]) {
      cert["color"] = `rgba(${red}, ${green}, 0)`;
    }

    certs.push(cert);
  }
  return certs;
};
