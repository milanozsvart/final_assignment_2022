import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";

export default function RegisterForm(props) {
  return (
    <div
      style={
        props.visibility ? { visibility: "visible" } : { visibility: "hidden" }
      }
    >
      <form id="register-form">
        <div id="register-form-inner">
          <p id="or-sign">OR</p>
          <h2>Register with email</h2>
          <input
            type="email"
            name="email"
            id="email-textField"
            placeholder="Enter your email..."
          />
          <br />
          <input
            type="password"
            name="password"
            id="password-textField"
            placeholder="Enter a password..."
          />
          <br />
          <input
            type="password"
            name="password"
            id="password-textField"
            placeholder="Confirm your password..."
          />
          <FontAwesomeIcon icon={faEye} className="eye" />
          <br />
          <button type="submit" id="register-btn">
            Register
          </button>
        </div>
        <div id="register-offer" style={{ border: "none" }}>
          <h3>Already have an account?</h3>
          <button onClick={props.toggleRegisterForm}>Login</button>
        </div>
      </form>
    </div>
  );
}
