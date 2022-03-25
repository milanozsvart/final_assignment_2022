import { React, useState, useEffect } from "react";
import Predictions from "../calculator_page/Predictions";

export default function () {
  const [todaysMatches, setTodaysMatches] = useState([]);
  const usersOffset = (new Date().getTimezoneOffset() * -1) / 60;

  useEffect(() => {
    fetchTodaysMatches();
  }, []);
  async function fetchTodaysMatches() {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      "http://127.0.0.1:5000/get_todays_matches_from_db",
      requestOptions
    );
    const data = await response.json();
    data["matches"].map((match) => {
      let timeString = match["date"];
      let hours = timeString[0] + timeString[1];
      hours = parseInt(hours) + usersOffset;
      if (hours > 23) {
        hours = hours - 24;
      }
      if (hours === 0) {
        hours = "00";
      }
      match["date"] = hours.toString() + ":" + timeString[3] + timeString[4];
    });
    setTodaysMatches(data["matches"]);
  }
  return (
    <div className="home-page-matches-wrapper">
      <h1>Today's matches</h1>
      <div className="todays-matches-container">
        <h1
          style={
            todaysMatches.length > 0
              ? { visibility: "hidden" }
              : { visibility: "visible" }
          }
        >
          No matches today :(
        </h1>
        {todaysMatches.map((match) => (
          <>
            <div className="match-container" key={match["id"]}>
              <span>{match["date"]}</span>
              <span>{match["tier"]}</span>
              <span>{match["round"]}</span>
              <span>{match["firstPlayer"]}</span>
              <span>{match["secondPlayer"]}</span>
              <span>{match["firstOdds"]}</span>
              <span>{match["secondOdds"]}</span>
            </div>
            <div>
              <Predictions
                player={match["pred"]["player"]}
                points={match["pred"]["points"]}
              />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
