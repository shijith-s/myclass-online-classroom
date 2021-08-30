import React from "react";
import "../css/SideBar.css";

function SideBar({ setmainContent }) {
  return (
    <div className="sidebar">
      <div
        onClick={() => {
          setmainContent("allclasses");
        }}
      >
        <h2>All classes</h2>
      </div>
      <div
        onClick={() => {
          setmainContent("assignments");
        }}
      >
        <h2>Assignments</h2>
      </div>
      <div
        onClick={() => {
          setmainContent("tests");
        }}
      >
        <h2>Tests</h2>
      </div>
      <div
        onClick={() => {
          setmainContent("calender");
        }}
      >
        <h2>Calender</h2>
      </div>
    </div>
  );
}

export default SideBar;
