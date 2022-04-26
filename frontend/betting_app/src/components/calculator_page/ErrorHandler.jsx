import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function ErrorHandler(props) {
  const exit = () => {
    props.setMessage("");
  };
  return (
    <>
      <div
        className="blurred-div"
        style={
          props.message === ""
            ? { visibility: "hidden" }
            : { visibility: "visible" }
        }
      ></div>
      <div
        id="error-screen-players"
        style={
          props.message === ""
            ? { visibility: "hidden" }
            : { visibility: "visible" }
        }
      >
        <div id="error-note">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          Error
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </div>

        <FontAwesomeIcon icon={faCircleXmark} id="exit-btn" onClick={exit} />
        <p
          style={
            props.message !== ""
              ? props.message.includes("cannot be")
                ? { visibility: "hidden" }
                : { visibility: "visible" }
              : {}
          }
        >
          Could not find these players:{" "}
        </p>
        <p className="names-errors"> {props.message}</p>
        <p
          style={
            props.message !== ""
              ? props.message.includes("cannot be")
                ? { visibility: "hidden" }
                : { visibility: "visible" }
              : {}
          }
        >
          Click on the players that pop up when you type to select a player!
        </p>
      </div>
    </>
  );
}
