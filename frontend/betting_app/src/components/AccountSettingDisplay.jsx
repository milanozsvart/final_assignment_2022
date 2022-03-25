import React from "react";
import ChangePassword from "./ChangePassword";

export default function AccountSettingDisplay(props) {
  if (props.currentSetting === "change-password") {
    return <ChangePassword />;
  } else {
    return null;
  }
}
