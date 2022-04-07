import React, { useContext, useState } from "react";
import AccountSettingDisplay from "./AccountSettingDisplay";
import { MainContext } from "./MainContext";

export default function AccountManagerWindow(props) {
  const logout = () => {
    localStorage.clear();
    props.setToken(false);
    props.setLoginFormVisibility(false);
  };

  const { setIsOpen, betsLength } = useContext(MainContext);

  const [currentSetting, setCurrentSetting] = useState();

  const handleCurrentSetting = (e) => {
    if (currentSetting === e.currentTarget.id) {
      setCurrentSetting(null);
    } else {
      setCurrentSetting(e.currentTarget.id);
      setIsOpen(true);
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
          id="bets"
          onClick={handleCurrentSetting}
        >
          My bets
        </div>
        <div
          className="account-setting"
          id="selected-matches"
          onClick={handleCurrentSetting}
        >
          Selected matches
          <div
            id="bets-number"
            style={betsLength < 1 ? { visibility: "hidden" } : {}}
          >
            {betsLength}
          </div>
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
