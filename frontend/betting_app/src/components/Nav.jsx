import React from 'react'
import '../App.css'
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const navStyle = {
    textDecoration: "none",
    color: "black",
  };
  const location = useLocation();
  return (
    <nav>
      <Link to="/" style={navStyle}>
        <div
          id={location.pathname === "/" ? "selected-nav-button" : ""}
          className="nav-button"
        >
          Home
        </div>
      </Link>
      <Link to="/calculator" style={navStyle}>
        <div
          id={location.pathname === "/calculator" ? "selected-nav-button" : ""}
          className="nav-button"
        >
          Calculator
        </div>
      </Link>
    </nav>
  );
}
