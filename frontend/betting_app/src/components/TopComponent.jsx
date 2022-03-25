import { React, useState } from "react";
import "../App.css";
import Nav from "./Nav";
import LoginForm from "./LoginForm";
import LoginButton from "./LoginButton";
import AccountSettingDisplay from "./AccountSettingDisplay";

export default function TopComponent() {
  const [loginFormVisibility, setLoginFormVisibility] = useState(false);
  const [token, setToken] = useState(false);
  const handleLoginFormVisibility = () => {
    if (!loginFormVisibility) {
      setRegisterForm(false);
    }
    setLoginFormVisibility(!loginFormVisibility);
  };
  const [isRegisterForm, setRegisterForm] = useState(false);

  const toggleRegisterForm = () => {
    setRegisterForm(!isRegisterForm);
  };
  return (
    <>
      <div id="hero-image"></div>
      <Nav />
      <LoginButton
        handleLoginFormVisibility={handleLoginFormVisibility}
        token={token}
        setToken={setToken}
      />
      <LoginForm
        loginFormVisibility={loginFormVisibility}
        setLoginFormVisibility={setLoginFormVisibility}
        isRegisterForm={isRegisterForm}
        toggleRegisterForm={toggleRegisterForm}
        token={token}
        setToken={setToken}
      />
    </>
  );
}
