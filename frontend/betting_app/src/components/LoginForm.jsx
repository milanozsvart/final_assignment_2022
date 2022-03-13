import { React, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import RegisterForm from "./RegisterForm";
import { useForm } from "react-hook-form";

export default function LoginForm(props) {
  let visibility = props.loginFormVisibility;
  const pwRef = useRef("");
  const [pwVisible, setPwVisible] = useState(false);
  const [pwFieldType, setPwFieldType] = useState("password");
  const [iconType, setIconType] = useState(faEye);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  async function login(data) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch("http://127.0.0.1:5000/login", requestOptions);
    const returnData = await response.json();
    if (returnData["successful"]) {
      alert("Success!");
    } else {
      alert("Not good!");
    }
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
        <form id="login-form" onSubmit={handleSubmit(login)}>
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
            {...register("email", { required: true })}
            placeholder="Enter your email..."
          />
          {errors.email && "Problem"}
          <br />
          <input
            type={pwFieldType}
            id="password-textField"
            {...register("password", { required: true })}
            placeholder="Enter your password..."
          />
          {errors.password1?.type}
          <FontAwesomeIcon
            icon={iconType}
            className="eye"
            onClick={handlePwVisible}
          />
          <br />
          <button type="submit" id="login-button">
            Login
          </button>
        </form>
      </div>
    );
  }
}
