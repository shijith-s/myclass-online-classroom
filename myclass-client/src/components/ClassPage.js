import React, { useRef, useEffect } from "react";
import UserContextProvider from "../context/UserContext";
import AssignmentsList from "./AssignmentsList";
import "../css/ClassPage.css";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASEURL;
const createAssignmentUrl = baseUrl + "/teacher/createassignment";

function ClassPage({ classData }) {
  const [userData, dispatch] = UserContextProvider();
  const createBlock = useRef();
  const assignmentForm = useRef();

  console.log(classData);

  // To add event listeners only after component mounted
  useEffect(() => {
    document.addEventListener("click", (e) => {
      closecreateBlock(e);
    });
    return () => {
      document.removeEventListener("click", (e) => {
        closecreateBlock(e);
      });
    };
  }, []);

  // ===========================  To open and close createBlock  ======================

  // Open createBlock
  const openCreateBlock = (e) => {
    e.stopPropagation();
    console.log("opening create block");
    if (createBlock.current)
      createBlock.current.classList.toggle("showcreateBlock");
  };

  // To close userinfo part while clicking any outside point
  const closecreateBlock = (e) => {
    console.log("closing create block");
    const createBtn = document.querySelector(".classpage__createBtn");
    if (
      createBlock.current &&
      createBtn &&
      createBtn !== e.target &&
      !createBtn.contains(e.target) &&
      createBlock.current.classList.contains("showcreateBlock")
    ) {
      if (
        createBlock.current &&
        createBlock.current !== e.target &&
        !createBlock.current.contains(e.target)
      ) {
        createBlock.current.classList.remove("showcreateBlock");
      }
    }
  };

  // ==========================================================================================

  // ===========================  To open the class creating or joining form  ======================

  const openForm = () => {
    if (assignmentForm.current) {
      assignmentForm.current.classList.toggle("showClassJoinCreateForm");
    }
  };

  // ==========================================================================================

  return (
    <div className="classpage">
      <div ref={assignmentForm} className="assignmentCreateForm">
        <CreateAssignmentForm openForm={openForm} classId={classData.classId} />
      </div>
      <div className="classpage__banner">
        <h1>{classData.classname}</h1>
        <h3>{classData.section}</h3>
        <h3>{classData.subject}</h3>
        <h3>{userData.name}</h3>
        <div
          className="classPage__classCode"
          onClick={() => navigator.clipboard.writeText(classData.classId)}
          title="Copy classcode"
        >
          <h3>{classData.classId}</h3>
        </div>
      </div>
      <a
        href="http://localhost:9000/attachments/document_2021-08-30T12-59-50.529Zwaterfall-min.jpg"
        download
      >
        Download
      </a>
      <a
        href="http://localhost:9000/attachments/document_2021-08-30T13-16-45.562Z1.pdf"
        download="newfile.pdf"
      >
        Download
      </a>
      <div className="classpage__assignments">
        <AssignmentsList assignmentData={classData.assignments} />
      </div>
      {sessionStorage.getItem("category") === "teacher" ? (
        <div className="classpage__create">
          <button className="classpage__createBtn" onClick={openCreateBlock}>
            <AddIcon className="classpage__createPlus" />
            Create
          </button>
          <div ref={createBlock} className="classpage__createOptions">
            <div onClick={openForm}>Assignments</div>
            <div>Tests</div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ClassPage;

const CreateAssignmentForm = ({ openForm, classId }) => {
  const [userData, dispatch] = UserContextProvider();

  // Code to create new class
  const createAssignment = (e) => {
    e.preventDefault();
    console.log(e.target.attachments.files);
    const assignmentData = new FormData();
    assignmentData.append("classId", classId);
    assignmentData.append("title", e.target.title.value);
    assignmentData.append("instructions", e.target.instructions.value);
    assignmentData.append("deadline", e.target.deadline.value);

    if (e.target.attachments.files.length != 0)
      for (let file of e.target.attachments.files) {
        assignmentData.append("attachments", file);
      }

    const token = sessionStorage.getItem("token");
    console.log(assignmentData.get("attachments"));
    axios
      .post(createAssignmentUrl, assignmentData, {
        headers: {
          authorization: "Bearer " + token,
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        dispatch({
          type: "ADD_USERDATA",
          data: { classes: res.data.classes },
        });
        openForm();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="assignmentForm">
      <CloseIcon className="assignmentForm__close" onClick={openForm} />
      <h2>Create new assignment</h2>
      <form onSubmit={createAssignment}>
        <label htmlFor="title">Enter Title</label>
        <input type="text" name="title" placeholder="title" required />
        <label htmlFor="instructions">Enter instructions</label>
        <textarea name="instructions" placeholder="instructions" row="10" />
        <label htmlFor="deadline">Enter subject</label>
        <input type="datetime-local" name="deadline" id="deadline" />
        <label htmlFor="attachments">Add attachments</label>
        <input type="file" name="attachments" id="attachments" multiple />
        <button type="submit">Create Assignment</button>
      </form>
    </div>
  );
};
