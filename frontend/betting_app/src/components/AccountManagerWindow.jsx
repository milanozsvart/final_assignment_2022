import React, { useState } from "react";
import AccountSettingDisplay from "./AccountSettingDisplay";

export default function AccountManagerWindow(props) {
  const logout = () => {
    localStorage.clear();
    props.setToken(false);
    props.setLoginFormVisibility(false);
  };

  const [currentSetting, setCurrentSetting] = useState();

  const handleCurrentSetting = (e) => {
    if (currentSetting === e.currentTarget.id) {
      setCurrentSetting(null);
    } else {
      setCurrentSetting(e.currentTarget.id);
    }
    props.setLoginFormVisibility(false);
  };
  return (
    <>
      <AccountSettingDisplay
        currentSetting={currentSetting}
        setCurrentSetting={setCurrentSetting}
      />
      <div
        id="account-manager-window"
        style={
          props.visibility
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
        <div
          className="account-setting"
          id="matches"
          onClick={handleCurrentSetting}
        >
          My matches
        </div>
        <div
          className="account-setting"
          id="bets"
          onClick={handleCurrentSetting}
        >
          My bets
        </div>
        <div
          className="account-setting"
          id="change-password"
          onClick={handleCurrentSetting}
        >
          Change password
        </div>
        <div id="logout-btn" onClick={logout}>
          Logout
        </div>
      </div>
    </>
  );
}
