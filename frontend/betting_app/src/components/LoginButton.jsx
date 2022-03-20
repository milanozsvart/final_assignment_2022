import React, { useState } from "react";

export default function LoginButton(props) {
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
          onClick={() => {
            localStorage.clear();
            props.setToken(false);
          }}
        >
          My account
        </div>
      </>
    );
  }
}
