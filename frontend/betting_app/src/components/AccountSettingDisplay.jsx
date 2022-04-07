import React from "react";
import ChangePassword from "./ChangePassword";
import SelectedMatches from "./SelectedMatches";
import Bets from "./Bets";

export default function AccountSettingDisplay(props) {
  if (props.currentSetting === "change-password") {
    return <ChangePassword setCurrentSetting={props.setCurrentSetting} />;
  } else if (props.currentSetting === "selected-matches") {
    return <SelectedMatches setCurrentSetting={props.setCurrentSetting} />;
  } else if (props.currentSetting === "bets") {
    return <Bets setCurrentSetting={props.setCurrentSetting} />;
  } else {
    return null;
  }
}
