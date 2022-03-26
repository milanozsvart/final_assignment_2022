import React from 'react'
import '../App.css'
import {Link} from 'react-router-dom'

export default function Nav() {
    const navStyle = {
        textDecoration: "none",
        color: "black"
    }
  return (
    <nav>
      <Link to="/" style={navStyle}>
        <div id="home-button" className="nav-button">
          Home
        </div>
      </Link>
      <Link to="/calculator" style={navStyle}>
        <div id="calculator-button" className="nav-button">
          Calculator
        </div>
      </Link>
      <Link to="/ranks" style={navStyle}>
        <div id="ranks-button" className="nav-button">
          Ranks
        </div>
      </Link>
    </nav>
  );
}
