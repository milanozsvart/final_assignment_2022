import { React, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import RegisterForm from "./RegisterForm";

export default function LoginForm(props) {
  let visibility = props.loginFormVisibility;
  const pwRef = useRef("");
  const [pwVisible, setPwVisible] = useState(false);
  const [pwFieldType, setPwFieldType] = useState("password");
  const [iconType, setIconType] = useState(faEye);

  const handlePwVisible = () => {
    if (pwVisible) {
      setPwFieldType("password");
      setIconType(faEye);
    } else {
      setPwFieldType("text");
      setIconType(faEyeSlash);
    }
    setPwVisible(!pwVisible);
  };

  if (props.isRegisterForm) {
    return (
      <RegisterForm
        toggleRegisterForm={props.toggleRegisterForm}
        visibility={visibility}
      />
    );
  } else {
    return (
      <div
        style={
          visibility ? { visibility: "visible" } : { visibility: "hidden" }
        }
      >
        <form id="login-form">
          <div id="register-offer">
            <h2>Not a member?</h2>
            <div id="register-btn" onClick={props.toggleRegisterForm}>
              Register
            </div>
            <p id="or-sign">OR</p>
          </div>
          <h3>Log in to your account!</h3>
          <input
            type="email"
            name="email"
            id="email-textField"
            placeholder="Enter your email..."
          />
          <br />
          <input
            type={pwFieldType}
            name="password"
            id="password-textField"
            placeholder="Enter your password..."
            ref={pwRef}
          />
          <FontAwesomeIcon
            icon={iconType}
            className="eye"
            onClick={handlePwVisible}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}
