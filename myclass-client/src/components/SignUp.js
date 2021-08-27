import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../css/Sign.css";
import axios from "axios";
import UserContextProvider from "../context/UserContext";

function SignUp() {
  const history = useHistory();
  const [state, dispatch] = UserContextProvider();
  const [category, setcategory] = useState("student");
  console.log(category);

  const signUpRequest = async (event) => {
    event.preventDefault();
    const inputData = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    const url = category === "student" ? "/student/signup" : "/teacher/signup";

    console.log(inputData);
    axios
      .post(url, inputData)
      .then((result) => {
        console.log(result);
        sessionStorage.setItem("token", result.data.jwtToken);
        sessionStorage.setItem("name", result.data.name);
        dispatch({
          type: "ADD_USER",
          name: result.data.name,
          token: result.data.jwtToken,
        });
        history.push("/home");
      })
      .catch((err) => {
        console.log("some error occured");
        console.log(err.response.data.message);
        alert(err.response.data.message);
      });
  };

  const changeUserType = (e, type) => {
    setcategory(type);
  };

  const pwdShowHide = (event) => {
    console.log("checkbox clicked");
    console.log(event.target.checked);
    if (event.target.checked) {
      document.querySelector(".login__password").type = "text";
    } else {
      document.querySelector(".login__password").type = "password";
    }
  };

  return (
    <div className="signUp">
      <div className="sign__body">
        <div className="sign__header">
          <Link to="/" className="link">
            <h2>hedwig</h2>
          </Link>
        </div>
        <div className="sign__form">
          <div className="sign__type">
            <button
              onClick={(e) => {
                changeUserType(e, "student");
              }}
              className="sign__typeBtn"
            >
              Student
            </button>
            <button
              onClick={(e) => {
                changeUserType(e, "teacher");
              }}
              className="sign__typeBtn"
            >
              Teacher
            </button>
          </div>
          <form onSubmit={signUpRequest}>
            <input
              type="text"
              minLength="6"
              name="name"
              placeholder="Enter your Name"
            />
            <input
              type="text"
              minLength="6"
              name="email"
              placeholder=" email"
            />
            <input
              type="password"
              minLength="6"
              name="password"
              placeholder="Password"
              className="login__password"
            />
            <div className="pwdCheckbox">
              <input
                type="checkbox"
                name="pwdCheck"
                value={true}
                onClick={pwdShowHide}
                id="pwdCheck"
                className="pwdCheck"
              />
              <label for="pwdCheck">Show password</label>
            </div>
            <button type="submit">Sign Up</button>
            <button>Sign Up using Google</button>
          </form>
          <h5 className="sign__alternate">
            Already have an account?{" "}
            <Link to="/signin" className="sign__alternateAnch">
              Sign In
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
