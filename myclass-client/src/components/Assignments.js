import React, { useState } from "react";
import UserContextProvider from "../context/UserContext";
import AssignmentsList from "./AssignmentsList";

function Assignments() {
  const [userData, dispatch] = UserContextProvider();
  const [createTask, setCreateTask] = useState(false);

  const allAssignments = userData.classes.reduce(
    (tempassignments, classData, index) => {
      if (classData.assignments) {
        classData.assignments.forEach((assignmentData) => {
          assignmentData.classname = classData.classname;
          assignmentData.classId = classData.classId;
          assignmentData.classroomId = classData._id;
        });
        return [...tempassignments, ...classData.assignments];
      }
    },
    []
  );
  console.log(allAssignments);

  const changeMainContent = (e, flag) => {
    console.log("changing content");
    setCreateTask(flag);
  };
  console.log("category:", sessionStorage.getItem("category"));
  return (
    <div>
      <h1>Assignments</h1>
      {sessionStorage.getItem("category") === "teacher" ? (
        <div className="assignmentBtnControls">
          <button
            onClick={(e) => {
              changeMainContent(e, false);
            }}
          >
            Assigned
          </button>
          <button
            onClick={(e) => {
              changeMainContent(e, true);
            }}
          >
            Create New
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="assignment__mainContent">
        {createTask ? (
          "create task"
        ) : (
          <AssignmentsList assignmentData={allAssignments} />
        )}
      </div>
    </div>
  );
}

export default Assignments;
