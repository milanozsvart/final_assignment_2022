import React from "react";
import Plot from "react-plotly.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";

export default function Ranks(props) {
  if (props.visibility) {
    return (
      <>
        <div className="blurred-div"></div>
        <div id="ranks-plot">
          <FontAwesomeIcon
            icon={faXmarkCircle}
            id="exit-btn-ranks"
            onClick={() => {
              props.setVisibility(false);
            }}
          />
          <Plot
            data={[
              {
                x: props.dates,
                y: props.ranks,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "cornflowerblue" },
              },
            ]}
            layout={{
              width: 800,
              height: 400,
              yaxis: { autorange: "reversed" },
              title: "Rank stats for " + props.player,
            }}
          />
        </div>
      </>
    );
  } else {
    return null;
  }
}
