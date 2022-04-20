import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { MainContext } from "./MainContext";
import MatchesBetted from "./MatchesBetted";

export default function Bets(props) {
  const exit = () => {
    props.setCurrentSetting(null);
    setIsOpen(false);
  };

  const [betsOnMatches, setBetsOnMatches] = useState({ bets: [], results: [] });
  const [currentlyOpen, setCurrentlyOpen] = useState("");
  const [betTypeSelected, setBetTypeSelected] = useState("all");

  useEffect(() => {
    fetchUserBets("all");
  }, []);

  async function fetchUserBets(betType) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        betType: betType,
      }),
    };
    const response = await fetch(
      `http://127.0.0.1:5000/get_users_bets`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    setBetsOnMatches(data);
  }
  const { setIsOpen } = useContext(MainContext);
  return (
    <>
      <div className="blurred-div"></div>
      <div className="bets-wrapper">
        <FontAwesomeIcon
          icon={faXmarkCircle}
          id="exit-btn-ranks"
          onClick={exit}
        />
        <h1>My bets</h1>
        <div id="bets-btns-container">
          <div
            onClick={() => {
              fetchUserBets("all");
            }}
          >
            all
          </div>
          <div
            onClick={() => {
              fetchUserBets("won");
            }}
          >
            won
          </div>
          <div
            onClick={() => {
              fetchUserBets("lost");
            }}
          >
            lost
          </div>
          <div
            onClick={() => {
              fetchUserBets("pending");
            }}
          >
            pending
          </div>
        </div>
        <div id="bets-container">
          {Object.keys(betsOnMatches["bets"])
            .slice(-8)
            .map((key) => {
              return (
                <>
                  <div
                    className="bet-item made-bets"
                    onClick={() => {
                      if (currentlyOpen !== key) {
                        setCurrentlyOpen(key);
                      } else {
                        setCurrentlyOpen(null);
                      }
                    }}
                  >
                    <span>{key}</span>
                    <span>{betsOnMatches["results"][key]}</span>
                  </div>
                  <MatchesBetted
                    matches={betsOnMatches["bets"][key]}
                    currentlyOpen={currentlyOpen}
                    betId={key}
                  />
                </>
              );
            })}
        </div>
      </div>
    </>
  );
}
