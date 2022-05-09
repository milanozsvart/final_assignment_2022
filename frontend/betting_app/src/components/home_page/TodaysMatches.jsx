import { React, useState, useEffect } from "react";
import AddToBets from "./AddToBets";
import Predictions from "../calculator_page/Predictions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareLeft } from "@fortawesome/free-regular-svg-icons";
import { faCaretSquareRight } from "@fortawesome/free-regular-svg-icons";
import { Textfit } from "react-textfit";

export default function TodaysMatches() {
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [headerText, setHeaderText] = useState("Today's matches");
  const [rightVisible, setRightVisible] = useState(false);
  const [leftVisible, setLeftVisible] = useState(true);
  const [isToday, setIsToday] = useState(true);
  const [finished, setFinished] = useState(false);
  const usersOffset = (new Date().getTimezoneOffset() * -1) / 60;
  const handleStyleChanging = (match) => {
    let matchWrapperStyle, matchContainerStyle;
    if (!isToday && match["result"] === null) {
      matchWrapperStyle = { display: "none" };
      matchContainerStyle = { display: "none" };
    } else {
      if (match["result"] && match["result"] === match["pred"]["player"]) {
        matchWrapperStyle = { border: "3px solid green" };
        matchContainerStyle = { backgroundColor: "green" };
      } else if (
        match["result"] &&
        match["result"] !== match["pred"]["player"]
      ) {
        matchWrapperStyle = { border: "3px solid red" };
        matchContainerStyle = { backgroundColor: "red" };
      } else {
        return [{}, {}];
      }
    }

    return [matchWrapperStyle, matchContainerStyle];
  };

  useEffect(fetchTodaysMatches, []);
  async function fetchTodaysMatches(
    dateToCheck = new Date().toISOString().split("T")[0]
  ) {
    setFinished(false);
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
      let timeString = match["time"];
      let hours = timeString[0] + timeString[1];
      hours = parseInt(hours) + usersOffset;
      if (hours > 23) {
        hours = hours - 24;
      }
      if (hours === 0) {
        hours = "00";
      }
      match["time"] = hours.toString() + ":" + timeString[3] + timeString[4];
      return data["matches"];
    });
    console.log(data);
    setTodaysMatches(data["matches"]);
    setFinished(true);
  }
  return (
    <>
      <div
        id="loader"
        style={finished ? { visibility: "hidden" } : { visibility: "visible" }}
      >
        <p>Fetching your matches...</p>
      </div>
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
          <div
            className="match-container match-header"
            style={
              todaysMatches.length > 0
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
          >
            <Textfit mode="single" max={16} className="match-container-span">
              {"Date"}
            </Textfit>
            <Textfit mode="single" max={16} className="match-container-span">
              {"Time"}
            </Textfit>

            <Textfit mode="single" max={16} className="match-container-span">
              {"Player 1"}
            </Textfit>
            <Textfit mode="single" max={16} className="match-container-span">
              {"Player 2"}
            </Textfit>
            <Textfit mode="single" max={16} className="match-container-span">
              {"Odds 1"}
            </Textfit>
            <Textfit mode="single" max={16} className="match-container-span">
              {"Odds 2"}
            </Textfit>

            <Textfit mode="single" max={16} className="match-container-span">
              {"Round"}
            </Textfit>
          </div>
          {todaysMatches.map((match) => {
            const styles = handleStyleChanging(match);
            if (match["pred"]["player"] != "Not known") {
              return (
                <div className="matches-wrapper" style={styles[0]}>
                  <div
                    className="match-container"
                    key={match["id"]}
                    id={match["id"]}
                    style={styles[1]}
                  >
                    <Textfit
                      mode="single"
                      max={24}
                      className="match-container-span"
                    >
                      {match["date"]}
                    </Textfit>
                    <Textfit
                      mode="single"
                      max={24}
                      className="match-container-span"
                    >
                      {match["time"]}
                    </Textfit>
                    <Textfit
                      mode="single"
                      max={28}
                      className="match-container-span player-identifier"
                    >
                      {match["firstPlayer"]}
                    </Textfit>
                    <Textfit
                      mode="single"
                      max={28}
                      className="match-container-span player-identifier"
                    >
                      {match["secondPlayer"]}
                    </Textfit>
                    <Textfit
                      mode="single"
                      max={24}
                      className="match-container-span"
                    >
                      {match["firstOdds"]}
                    </Textfit>
                    <Textfit
                      mode="single"
                      max={24}
                      className="match-container-span"
                    >
                      {match["secondOdds"]}
                    </Textfit>

                    <Textfit
                      mode="single"
                      max={24}
                      className="match-container-span"
                    >
                      {match["round"]}
                    </Textfit>
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
            }
          })}
        </div>
      </div>
    </>
  );
}
