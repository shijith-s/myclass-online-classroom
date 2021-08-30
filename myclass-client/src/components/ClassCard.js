import React, { useRef, useEffect } from "react";
import "../css/ClassCard.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import axios from "axios";
import UserContextProvider from "../context/UserContext";

const baseUrl = process.env.REACT_APP_BASEURL;

function ClassCard({ classData, setmainContent }) {
  const [userData, dispatch] = UserContextProvider();
  // ============================  userefs  ============================
  const card = useRef();
  const dropdown = useRef();

  const category = sessionStorage.getItem("category");
  console.log(category);

  // =============================   UnEnroll function  =========================
  // ============================== delete class function   =====================

  const leaveOrDelete = () => {
    const url =
      baseUrl +
      (category === "student" ? "/student/leaveclass" : "/teacher/deleteclass");
    const token = sessionStorage.getItem("token");
    console.log(url);
    axios
      .delete(url, {
        headers: {
          authorization: "Bearer " + token,
        },
        data: {
          classId: classData.classId,
        },
      })
      .then((res) => {
        console.log(res);
        dispatch({
          type: "ADD_USERDATA",
          data: { classes: res.data },
        });
        if (dropdown.current)
          dropdown.current.classList.remove("classCard__showDropdown");
      });
  };

  // ============================================================================

  useEffect(() => {
    if (card.current) {
      card.current.addEventListener("click", (e) => {
        if (!e.target.classList.contains("classCard__dropdown")) {
          console.log("outside dropdown");
          if (dropdown.current)
            dropdown.current.classList.remove("classCard__showDropdown");
        }
      });
    }
    return () => {};
  }, []);

  const openDropdown = () => {
    dropdown.current.classList.toggle("classCard__showDropdown");
  };
  return (
    <div
      ref={card}
      className="classCard"
      onClick={() => {
        setmainContent("specificClass", classData);
      }}
    >
      <div className="classCard__options">
        <MoreVertIcon className="classCard__vertIcon" onClick={openDropdown} />
        <div ref={dropdown} className="classCard__dropdown">
          {category === "student" ? (
            <h5 onClick={leaveOrDelete}>Unenroll</h5>
          ) : (
            <div>
              <h5 onClick={leaveOrDelete}>Delete</h5>
              <hr />
              <h5
                onClick={() => navigator.clipboard.writeText(classData.classId)}
              >
                Copy&nbsp;Invite&nbsp;Link
              </h5>
            </div>
          )}
        </div>
      </div>
      <div className="classCard__classInfo">
        <h3>{classData.classname}</h3>
        <p>{classData.section}</p>
        <p>{classData.subject}</p>
        <h5>{classData.createdBy ? classData.createdBy.name : ""}</h5>
      </div>
      <div className="classCard__classNotifications"></div>
    </div>
  );
}

export default ClassCard;
