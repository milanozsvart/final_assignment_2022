import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function CalculatorPerformanceStats(props) {
  const opponentRanks = props.opponentRanks;
  const performanceBetweenRanks = props.performanceBetweenRanks;

  const [visibility, setVisibility] = useState(0);
  const [visibilityStyle, setVisibilityStyle] = useState({
    opacity: 0,
  });

  const handleVisibility = () => {
    if (visibility === 1) {
      setVisibility(0);
      setVisibilityStyle({ opacity: 0 });
    } else {
      setVisibility(1);
      setVisibilityStyle({ opacity: 1 });
    }
  };
  return (
    <>
      <FontAwesomeIcon
        icon={faCircleInfo}
        className="circle-info-player-stats"
        onClick={handleVisibility}
      />
      <div className="get-player-matches" style={visibilityStyle}>
        <p>All matches</p>
        <p>Matches won</p>
        <p>Matches won 2-0</p>
        <p>Matches lost</p>
      </div>
      <div className="performance-stats-ranks">
        {"Opponent's rank: " + opponentRanks}
      </div>
      <div className="performance-stats-section">
        {Object.keys(performanceBetweenRanks[opponentRanks]).map((label) => (
          <div className="perfromance-stats-individual">
            <div>{label}</div>
            <div>{performanceBetweenRanks[opponentRanks][label]}</div>
          </div>
        ))}
      </div>
    </>
  );
}
