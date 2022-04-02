import { React, useState, useEffect } from "react";
import AddToBets from "./AddToBets";
import Predictions from "../calculator_page/Predictions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareLeft } from "@fortawesome/free-regular-svg-icons";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";

export default function () {
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [headerText, setHeaderText] = useState("Today's matches");
  const [rightVisible, setRightVisible] = useState(false);
  const [leftVisible, setLeftVisible] = useState(true);
  const [isToday, setIsToday] = useState(true);
  const usersOffset = (new Date().getTimezoneOffset() * -1) / 60;
  const handleStyleChanging = (match) => {
    let matchWrapperStyle, matchContainerStyle;
    if (!isToday && match["result"] === match["pred"]["player"]) {
      matchWrapperStyle = { border: "3px solid green" };
      matchContainerStyle = { backgroundColor: "green" };
    } else if (!isToday && match["result"] != match["pred"]["player"]) {
      matchWrapperStyle = { border: "3px solid red" };
      matchContainerStyle = { backgroundColor: "red" };
    } else {
      return [{}, {}];
    }
    return [matchWrapperStyle, matchContainerStyle];
  };

  useEffect(() => {
    fetchTodaysMatches();
  }, []);
  async function fetchTodaysMatches(
    dateToCheck = new Date().toISOString().split("T")[0]
  ) {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      `http://127.0.0.1:5000/get_todays_matches_from_db/${dateToCheck}`,
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
      <div id="home-page-matches-header">
        <FontAwesomeIcon
          icon={faCaretSquareLeft}
          id="go-left-btn"
          style={leftVisible ? { display: "block" } : { display: "none" }}
          onClick={() => {
            let dateToCheck = new Date();
            dateToCheck = new Date(
              dateToCheck.setDate(dateToCheck.getDate() - 1)
            );
            dateToCheck = dateToCheck.toISOString().split("T")[0];
            setTodaysMatches([]);
            fetchTodaysMatches(dateToCheck);
            setHeaderText("Yesterday's matches");
            setLeftVisible(false);
            setRightVisible(true);
            setIsToday(false);
          }}
        />
        <FontAwesomeIcon
          icon={faCaretSquareRight}
          id="go-right-btn"
          style={rightVisible ? { display: "block" } : { display: "none" }}
          onClick={() => {
            setLeftVisible(true);
            setRightVisible(false);
            setTodaysMatches([]);
            fetchTodaysMatches();
            setHeaderText("Today's matches");
            setIsToday(true);
          }}
        />
        <h1>{headerText}</h1>
      </div>
      <div className="todays-matches-container">
        <h1
          style={
            todaysMatches.length > 0
              ? { visibility: "hidden" }
              : { visibility: "visible" }
          }
        >
          {isToday
            ? "No matches today :("
            : "There were no matches yesterday :("}
        </h1>
        {todaysMatches.map((match) => {
          const styles = handleStyleChanging(match);
          return (
            <div className="matches-wrapper" style={styles[0]}>
              <div
                className="match-container"
                key={match["id"]}
                style={styles[1]}
              >
                <span>{match["date"]}</span>
                <span>{match["tier"]}</span>
                <span>{match["round"]}</span>
                <span>{match["firstPlayer"]}</span>
                <span>{match["secondPlayer"]}</span>
                <span>{match["firstOdds"]}</span>
                <span>{match["secondOdds"]}</span>
              </div>

              <Predictions
                player={
                  match["pred"]["player"] ? match["pred"]["player"] : null
                }
                points={
                  match["pred"]["points"] ? match["pred"]["points"] : null
                }
              />

              <AddToBets match={match} isToday={isToday} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
