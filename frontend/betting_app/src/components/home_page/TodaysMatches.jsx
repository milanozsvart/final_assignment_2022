import { React, useState, useEffect } from "react";

export default function () {
  const matches = [
    {
      id: 1,
      firstPlayer: "Barty A.",
      secondPlayer: "Sabalenka A.",
      date: "2022.03.11",
      tier: "W1000",
      round: "Semifinals",
      odds1: 1.5,
      odds2: 2.1,
    },
    {
      id: 2,
      firstPlayer: "Badosa P.",
      secondPlayer: "Paolini J.",
      date: "2022.03.11",
      tier: "W1000",
      round: "Semifinals",
      firstOdds: 1.2,
      secondOdds: 4,
    },
  ];
  const [todaysMatches, setTodaysMatches] = useState(matches);

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
    setTodaysMatches(data["matches"]);
  }
  return (
    <div className="home-page-matches-wrapper">
      <h1>Today's matches</h1>
      <div className="todays-matches-container">
        {todaysMatches.map((match) => (
          <div className="match-container" key={match["id"]}>
            <span>{match["date"]}</span>
            <span>{match["tier"]}</span>
            <span>{match["round"]}</span>
            <span>{match["firstPlayer"]}</span>
            <span>{match["secondPlayer"]}</span>
            <span>{match["firstOdds"]}</span>
            <span>{match["secondOdds"]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
