import { React, useState } from "react";
import "../App.css";
import Nav from "./Nav";
import LoginForm from "./LoginForm";

export default function TopComponent() {
  const [loginFormVisibility, setLoginFormVisibility] = useState(false);
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
      <div id="login-btn" onClick={handleLoginFormVisibility}>
        Login
      </div>
      <LoginForm
        loginFormVisibility={loginFormVisibility}
        isRegisterForm={isRegisterForm}
        toggleRegisterForm={toggleRegisterForm}
      />
    </>
  );
}
