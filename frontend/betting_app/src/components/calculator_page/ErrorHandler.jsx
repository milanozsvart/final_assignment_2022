import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

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
        <FontAwesomeIcon icon={faCircleXmark} id="exit-btn" onClick={exit} />
        <p>Could not find these players: </p>
        <p className="names-errors"> {props.message}</p>
        <p>
          Click on the players that pop up when you type to select a player!
        </p>
      </div>
    </>
  );
}
