import React from "react";
import ChangePassword from "./ChangePassword";
import Bets from "./Bets";

export default function AccountSettingDisplay(props) {
  if (props.currentSetting === "change-password") {
    return <ChangePassword setCurrentSetting={props.setCurrentSetting} />;
  } else if (props.currentSetting === "bets") {
    return <Bets />;
  } else {
    return null;
  }
}
