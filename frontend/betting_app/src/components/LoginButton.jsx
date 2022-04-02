import React, { useContext, useState } from "react";
import { MainContext } from "./MainContext";

export default function LoginButton(props) {
  const { betsLength } = useContext(MainContext);
  if (!props.token) {
    return (
      <div
        className="login-and-account-btn"
        id="login-btn"
        onClick={props.handleLoginFormVisibility}
      >
        Login
      </div>
    );
  } else {
    return (
      <>
        <p id="account-email">{localStorage.getItem("user")}</p>
        <div
          className="login-and-account-btn"
          id="account-btn"
          onClick={props.handleLoginFormVisibility}
        >
          My account
          <div
            id="bets-number"
            style={
              betsLength < 1 || props.loginFormVisibility
                ? { visibility: "hidden" }
                : {}
            }
          >
            {betsLength}
          </div>
        </div>
      </>
    );
  }
}
