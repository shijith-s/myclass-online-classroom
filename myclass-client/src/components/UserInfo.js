import React, { useState } from "react";
import UserContextProvider from "../context/UserContext";
import profileAvatar from "../images/avatar1.svg";
import "../css/UserInfo.css";
import { useHistory } from "react-router-dom";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

function UserInfo() {
  const [userData, dispatch] = UserContextProvider();

  const history = useHistory();
  console.log(userData);
  // const userInfo = userData.userInfo;
  const userInfo = {
    name: "shijith",
    username: "shijithsanthosh",
  };

  const logout = () => {
    sessionStorage.clear();
    dispatch({
      type: "REMOVE_USER",
    });
    history.push("/");
  };

  console.log(userInfo);

  // to show and hide password updating form
  // const [pwdForm, setPwdForm] = useState(["", false]);
  const showHidePwdForm = () => {
    const pwdForm = document.querySelector(".userInfo__pwdForm");
    if (pwdForm.style.display === "none") {
      pwdForm.style.display = "block";
    } else {
      pwdForm.style.display = "none";
    }
  };

  return (
    <div className="userInfo">
      <div className="userInfo__profile">
        <div className="userInfo__profilePic">
          <img src={profileAvatar} alt="" />
        </div>
      </div>
      <h2 className="userInfo__heading">Hello {userInfo.name}</h2>
      <div className="userInfo__details">
        <p>Signed in as {userInfo.username}</p>
      </div>

      <button className="userInfo__logout" onClick={logout}>
        Log out
      </button>
    </div>
  );
}

export default UserInfo;
