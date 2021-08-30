import React from "react";
import ClassCard from "./ClassCard";
import UserContextProvider from "../context/UserContext";

function ClassGrid({ setmainContent }) {
  const [userData, dispatch] = UserContextProvider();
  return (
    <div>
      {userData.classes ? (
        <div className="userpage__mainGrid">
          {userData.classes.map((classData, index) => (
            <ClassCard
              key={index}
              classData={classData}

              setmainContent={setmainContent}
            />
          ))}
        </div>
      ) : (
        <h2>
          {userData.category === "student"
            ? "You are not enrolled to any class!"
            : "You haven't created any class yet"}
        </h2>
      )}
    </div>
  );
}

export default ClassGrid;
