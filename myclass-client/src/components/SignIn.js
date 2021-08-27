import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../css/Sign.css";
import axios from "axios";
import UserContextProvider from "../context/UserContext";

function SignIn() {
  const history = useHistory();
  const [state, dispatch] = UserContextProvider();
  const [category, setcategory] = useState("student");
  console.log(category);
  const signInRequest = async (event) => {
    event.preventDefault();
    const inputData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    const url = category === "student" ? "/student/login" : "/teacher/login";

    console.log(inputData);
    console.log(url);
    axios
      .post(url, inputData)
      .then((result) => {
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
    <div className="signIn">
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
          <form onSubmit={signInRequest}>
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
            <button type="submit">Sign In</button>
            <button>Sign In using Google</button>
          </form>
          <h5 className="sign__alternate">
            Don't have an account?{" "}
            <Link to="/signup" className="sign__alternateAnch">
              Sign Up
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
