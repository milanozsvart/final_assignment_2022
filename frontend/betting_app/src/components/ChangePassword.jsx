import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function ChangePassword(props) {
  const [iconTypeFirst, setIconTypeFirst] = useState(faEye);
  const [iconTypeSecond, setIconTypeSecond] = useState(faEye);
  const [iconTypeThird, setIconTypeThird] = useState(faEye);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const handlePwVisible = (event) => {
    const parentDiv = event.currentTarget.parentNode;
    const pwInput = parentDiv.querySelector("input");

    if (pwInput.type == "text") {
      pwInput.type = "password";
      if (parentDiv.id === "first") {
        setIconTypeFirst(faEye);
      } else if (parentDiv.id == "second") {
        setIconTypeSecond(faEye);
      } else {
        setIconTypeThird(faEye);
      }
    } else {
      pwInput.type = "text";
      if (parentDiv.id === "first") {
        setIconTypeFirst(faEyeSlash);
      } else if (parentDiv.id == "second") {
        setIconTypeSecond(faEyeSlash);
      } else {
        setIconTypeThird(faEyeSlash);
      }
    }
  };

  async function onSubmit(data) {
    delete data.confirmPassword;
    data["token"] = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch(
      "http://127.0.0.1:5000/change_password",
      requestOptions
    );
    const returnData = await response.json();
    if (returnData["successful"]) {
      alert("good");
    } else {
      alert("not good");
    }
  }

  return (
    <>
      <div className="blurred-div"></div>
      <div className="change-password">
        <FontAwesomeIcon
          icon={faXmarkCircle}
          id="exit-btn"
          onClick={() => {
            props.setCurrentSetting(null);
            document.querySelector("main").style.filter = null;
          }}
        />
        <h2>Change password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="">Current password</label>
          <div className="visible-password" id="first">
            <input
              type="password"
              {...register("currentPassword", { required: true })}
              placeholder="Enter your current password..."
            />
            <FontAwesomeIcon
              icon={iconTypeFirst}
              className="eye"
              onClick={handlePwVisible}
              id="first-password-eye"
            />
          </div>
          <label htmlFor="">New password</label>
          <div className="visible-password" id="second">
            <input
              type="password"
              {...register("newPassword", { required: true })}
              placeholder="Enter your new password..."
            />
            <FontAwesomeIcon
              icon={iconTypeSecond}
              className="eye"
              onClick={handlePwVisible}
              id="first-password-eye"
            />
          </div>
          <label htmlFor="">Confirm new password</label>
          <div className="visible-password" id="third">
            <input
              type="password"
              {...register("confirmPassword", {
                validate: (value) => value === watch("newPassword"),
              })}
              placeholder="Confirm new password..."
            />
            <FontAwesomeIcon
              icon={iconTypeThird}
              className="eye"
              onClick={handlePwVisible}
              id="first-password-eye"
            />
          </div>
          <button type="submit" id="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
