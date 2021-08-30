import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import "../css/UserPage.css";
import UserContextProvider from "../context/UserContext";
import CloseIcon from "@material-ui/icons/Close";
import SideBar from "./SideBar";
import ClassGrid from "./ClassGrid";
import Assignments from "./Assignments";
import ClassPage from "./ClassPage";

const baseUrl = process.env.REACT_APP_BASEURL;
const joinClassUrl = baseUrl + "/student/joinclass";

function StudentPage() {
  const history = useHistory();
  const [userData, dispatch] = UserContextProvider();

  const classForm = useRef();
  const sideBar = useRef();
  console.log(userData);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) history.push("/signin");
  }, []);

  // To add event listeners only after component mounted
  useEffect(() => {
    document.addEventListener("click", (e) => {
      closeSidebar(e);
    });
    return () => {
      document.removeEventListener("click", (e) => {
        closeSidebar(e);
      });
    };
  }, [userData]);

  // ===========================  To open the class creating or joining form  ======================

  const openForm = () => {
    if (classForm.current) {
      classForm.current.classList.toggle("showClassJoinCreateForm");
    }
  };

  // ==========================================================================================
  // ===========================  To open and close sidebar  ======================

  // Open sidebar
  const openCloseSidebar = () => {
    console.log("opening sidebar");
    if (sideBar.current) sideBar.current.classList.toggle("showsidebar");
  };

  // To close userinfo part while clicking any outside point
  const closeSidebar = (e) => {
    console.log("closing sidebar");
    const hamburger = document.querySelector(".header__hamburger");
    // console.log(hamburger);
    // console.log(e.target);
    if (
      sideBar.current &&
      hamburger !== e.target &&
      !hamburger.contains(e.target) &&
      sideBar.current.classList.contains("showsidebar")
    ) {
      if (
        sideBar.current &&
        sideBar.current !== e.target &&
        !sideBar.current.contains(e.target)
      ) {
        sideBar.current.classList.remove("showsidebar");
      }
    }
  };

  // ==========================================================================================

  // =======================  function for setting main content  ===========================

  const setmainContent = (type, data) => {
    console.log("changing main content");
    switch (type) {
      case "specificClass":
        setMainContent(<ClassPage classData={data} />);
        break;
      case "allclasses":
        setMainContent(<ClassGrid setmainContent={setmainContent} />);
        break;
      case "tests":
        setMainContent(<h1>Tests</h1>);
        break;
      case "assignments":
        setMainContent(<Assignments />);
        break;
      case "calender":
        setMainContent(<h1>Calender</h1>);
        break;
      default:
        setMainContent(<ClassGrid setmainContent={setmainContent} />);
    }
    openCloseSidebar();
  };
  const [mainContent, setMainContent] = useState(
    <ClassGrid setmainContent={setmainContent} />
  );
  // ==========================================================================================

  return (
    <div className="userpage">
      <Header openForm={openForm} openCloseSidebar={openCloseSidebar} />
      <div ref={classForm} className="classJoinCreateForm">
        <ClassJoinForm openForm={openForm} />
      </div>
      <div className="userpage__content">
        <div ref={sideBar} className="userpage__sidebar">
          <SideBar setmainContent={setmainContent} />
        </div>
        <div className="userpage__mainContent">{mainContent}</div>
      </div>
    </div>
  );
}

export default StudentPage;

const ClassJoinForm = ({ openForm }) => {
  const [userData, dispatch] = UserContextProvider();

  // Code for joining a class
  const joinClass = (e) => {
    e.preventDefault();
    const classcode = e.target.classcode.value;
    const token = sessionStorage.getItem("token");
    console.log("Joining class", token);
    axios
      .post(
        joinClassUrl,
        {
          classId: classcode,
        },
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        dispatch({
          type: "ADD_USERDATA",
          data: { classes: res.data },
        });
        openForm();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className="classForm">
      <CloseIcon className="classForm__close" onClick={openForm} />
      <h2>Join a class</h2>
      <form onSubmit={joinClass}>
        <label htmlFor="classcode">Enter the class code</label>
        <input type="text" name="classcode" placeholder="Class Code" />
        <button type="submit">Join class</button>
      </form>
    </div>
  );
};
