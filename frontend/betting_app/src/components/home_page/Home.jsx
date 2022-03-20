import React from "react";
import "../../App.css";
import TodaysMatches from "./TodaysMatches";

export default function Home() {
  console.log(localStorage.getItem("loggedIn"));
  return <TodaysMatches />;
}
