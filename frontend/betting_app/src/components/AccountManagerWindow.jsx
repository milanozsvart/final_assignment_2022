import React from "react";

export default function AccountManagerWindow(props) {
  const logout = () => {
    localStorage.clear();
    props.setToken(false);
    props.setLoginFormVisibility(false);
  };
  return (
    <div
      id="account-manager-window"
      style={
        props.visibility ? { visibility: "visible" } : { visibility: "hidden" }
      }
    >
      <div className="account-setting">Account settings</div>
      <div className="account-setting">My matches</div>
      <div className="account-setting">My bets</div>
      <div id="logout-btn" onClick={logout}>
        Logout
      </div>
    </div>
  );
}
