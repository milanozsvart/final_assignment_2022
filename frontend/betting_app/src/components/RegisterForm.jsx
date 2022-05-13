import { React, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";

export default function RegisterForm(props) {
  const messageRef = useRef();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [iconTypeFirst, setIconTypeFirst] = useState(faEye);
  const [iconTypeSecond, setIconTypeSecond] = useState(faEye);

  const handlePwVisible = (event) => {
    const parentDiv = event.currentTarget.parentNode;
    const pwInput = parentDiv.querySelector("input");

    if (pwInput.type === "text") {
      pwInput.type = "password";
      if (parentDiv.id === "first") {
        setIconTypeFirst(faEye);
      } else {
        setIconTypeSecond(faEye);
      }
    } else {
      pwInput.type = "text";
      if (parentDiv.id === "first") {
        setIconTypeFirst(faEyeSlash);
      } else {
        setIconTypeSecond(faEyeSlash);
      }
    }
  };

  async function onSubmit(data) {
    delete data.confirmPassword;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/register",
      requestOptions
    );
    const returnData = await response.json();
    messageRef.current.innerText = returnData["message"];
    if (returnData["successful"]) {
      messageRef.current.id = "success-message";
    } else {
      messageRef.current.id = "error-message";
    }
  }
  return (
    <div
      style={
        props.visibility ? { visibility: "visible" } : { visibility: "hidden" }
      }
    >
      <form
        id="register-form"
        className="login-register"
        onSubmit={handleSubmit(onSubmit)}
      >
        <span ref={messageRef}></span>
        <div id="register-form-inner">
          <p id="or-sign">OR</p>
          <h2>Register with email</h2>
          <div className="error-message">
            {errors.email?.type === "required" && "Email is required"}
          </div>
          <input
            type="email"
            {...register("email", { required: true })}
            id="email-textField"
            placeholder="Enter your email..."
          />
          <br />
          <div className="error-message">
            {errors.password?.type === "required" && "Password is required"}
          </div>
          <div className="visible-password" id="first">
            <input
              type="password"
              name="password"
              {...register("password", { required: true })}
              id="password-textField"
              placeholder="Enter a password..."
            />
            <FontAwesomeIcon
              icon={iconTypeFirst}
              className="eye"
              onClick={handlePwVisible}
            />
          </div>
          <br />
          <div className="error-message">
            {errors.confirmPassword?.type === "validate" &&
              "Passwords don't match"}
          </div>
          <div className="visible-password" id="second">
            <input
              type="password"
              id="confirmPassword-textField"
              {...register("confirmPassword", {
                validate: (value) => value === watch("password"),
              })}
              placeholder="Confirm your password..."
            />
            <FontAwesomeIcon
              icon={iconTypeSecond}
              className="eye"
              onClick={handlePwVisible}
            />
          </div>
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
