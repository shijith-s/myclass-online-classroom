import React from "react";
import "../css/AssignmentsList.css";

function AssignmentsList({ assignmentData }) {
  console.log(assignmentData);
  return (
    <div className="assignmentsList">
      {assignmentData.map((assignment) => (
        <AssignmentBody assignment={assignment} />
      ))}
    </div>
  );
}

export default AssignmentsList;

const AssignmentBody = ({ assignment }) => {
  console.log(assignment);
  // console.log(typeof assignment.deadline);
  return (
    <div className="assignment__body">
      <h2 className="assignment__bodyTitle">{assignment.title}</h2>
      <h4 className="assignment__bodyClassname">{assignment.classname}</h4>
      <p className="assignment__bodyInstructions">
        {assignment.instructions ? assignment.instructions : null}
      </p>
      <div className="assignment__bodyAttachments">
        <p>{assignment.attachments ? assignment.attachments : null}</p>
      </div>
      <p className="assignment__bodyDeadline">
        {assignment.deadline
          ? new Date(assignment.deadline).toDateString() +
            "\t\t\t\t\t\t" +
            new Date(assignment.deadline).toLocaleTimeString()
          : "No due date"}
      </p>
    </div>
  );
};
