import { React, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import RegisterForm from "./RegisterForm";
import { useForm } from "react-hook-form";
import AccountManagerWindow from "./AccountManagerWindow";

export default function LoginForm(props) {
  let visibility = props.loginFormVisibility;
  const messageRef = useRef();
  const [iconTypeFirst, setIconTypeFirst] = useState(faEye);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePwVisible = (event) => {
    const parentDiv = event.currentTarget.parentNode;
    const pwInput = parentDiv.querySelector("input");

    if (pwInput.type == "text") {
      pwInput.type = "password";
      setIconTypeFirst(faEye);
    } else {
      pwInput.type = "text";
      setIconTypeFirst(faEyeSlash);
    }
  };

  async function login(data) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch("http://127.0.0.1:5000/login", requestOptions);
    const returnData = await response.json();
    messageRef.current.innerText = returnData["message"];
    if (returnData["successful"]) {
      localStorage.setItem("token", returnData["token"]);
      localStorage.setItem("user", data["email"]);
      props.setLoginFormVisibility(false);
      props.setToken(true);
      messageRef.current.id = "success-message";
    } else {
      messageRef.current.id = "error-message";
    }
  }

  if (props.token) {
    return (
      <AccountManagerWindow
        setLoginFormVisibility={props.setLoginFormVisibility}
        visibility={visibility}
        setToken={props.setToken}
      />
    );
  }

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
        <form
          id="login-form"
          className="login-register"
          onSubmit={handleSubmit(login)}
        >
          <div id="register-offer">
            <h2>Not a member?</h2>
            <div id="register-btn" onClick={props.toggleRegisterForm}>
              Register
            </div>
            <p id="or-sign">OR</p>
          </div>
          <span style={{ marginTop: "1.5rem" }} ref={messageRef}></span>
          <h3>Log in to your account!</h3>
          <div className="error-message">
            {errors.email?.type === "required" && "Email is required"}
          </div>
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Enter your email..."
          />
          <br />
          <div className="error-message">
            {errors.password?.type === "required" && "Password is required"}
          </div>
          <div className="visible-password" id="first-password">
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Enter your password..."
            />
            <FontAwesomeIcon
              icon={iconTypeFirst}
              className="eye"
              onClick={handlePwVisible}
              id="first-password-eye"
            />
            <p id="forgot-password">Forgot your password?</p>
          </div>
          <br />
          <button type="submit" id="login-button">
            Login
          </button>
        </form>
      </div>
    );
  }
}
