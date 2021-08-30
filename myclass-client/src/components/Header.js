import React, { useState, useRef, useEffect } from "react";
import "../css/Header.css";
import profileAvatar from "../images/avatar1.svg";
import UserContextProvider from "../context/UserContext";
import axios from "axios";
import UserInfo from "./UserInfo";
import AddIcon from "@material-ui/icons/Add";
import MenuIcon from "@material-ui/icons/Menu";

const baseUrl = process.env.REACT_APP_BASEURL;

function Header({ openForm, openCloseSidebar }) {
  const [userData] = UserContextProvider();
  console.log(userData);

  // =========================  use refs  ==================================================

  const userInfoBlock = useRef(0);
  const dropDownBlock = useRef(0);
  const profileBlock = useRef(0);

  // showing and hiding userInfo part
  const toggleUserInfo = () => {
    console.log("toggling userinfo");
    userInfoBlock.current.classList.toggle("hidden_userpage__userInfo");
    console.log(userInfoBlock.current.classList);
  };

  // Hide dropdown when user clicks somewhere other than dropdown
  const hideDropdown = (e) => {
    // e.stopPropagation();
    if (
      dropDownBlock.current &&
      dropDownBlock.current !== e.target &&
      !dropDownBlock.current.contains(e.target)
    ) {
      console.log("outside dropdown");
      dropDownBlock.current.style.display = "none";
    }
  };

  // To add event listeners only after component mounted
  useEffect(() => {
    document.addEventListener("click", (e) => {
      hideDropdown(e);
      hideUserInfo(e);
    });
    return () => {
      document.removeEventListener("click", (e) => {
        hideDropdown(e);
        hideUserInfo(e);
      });
    };
  }, []);

  // To close userinfo part while clicking any outside point
  const hideUserInfo = (e) => {
    if (
      userInfoBlock.current &&
      !profileBlock.current.contains(e.target) &&
      !userInfoBlock.current.classList.contains("hidden_userpage__userInfo")
    ) {
      if (
        userInfoBlock.current &&
        userInfoBlock.current !== e.target &&
        !userInfoBlock.current.contains(e.target)
      ) {
        console.log("outside userinfo");
        userInfoBlock.current.classList.add("hidden_userpage__userInfo");
      }
    }
  };

  // ====================================================================================

  return (
    <div className="header">
      <div className="header__fullLogo">
        <div className="header__hamburger" onClick={openCloseSidebar}>
          <MenuIcon className="header__hamburgerIcon" />
        </div>
        <h2>MyClass</h2>
      </div>
      <div className="header__right">
        <div
          className="header__plus"
          onClick={openForm}
          title={
            userData.category === "student"
              ? "Join a Class"
              : "Create new class"
          }
        >
          <AddIcon style={{ fontSize: "35px" }} />
        </div>
        <div
          ref={profileBlock}
          className="header__profile"
          title="Open user profile"
          onClick={toggleUserInfo}
        >
          <img src={profileAvatar} alt="" />
        </div>
      </div>
      <div
        ref={userInfoBlock}
        className="userpage__userInfo hidden_userpage__userInfo"
      >
        <UserInfo />
      </div>
    </div>
  );
}

export default Header;
