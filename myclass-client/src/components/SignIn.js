import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../css/Sign.css";
import axios from "axios";
import UserContextProvider from "../context/UserContext";

const baseUrl = process.env.REACT_APP_BASEURL;

function SignIn() {
  const history = useHistory();
  const [state, dispatch] = UserContextProvider();
  const [category, setcategory] = useState("student");
  console.log(category);
  const signInRequest = async (event) => {
    event.preventDefault();
    const inputData = {
      username: event.target.username.value,
      password: event.target.password.value,
    };

    const url =
      baseUrl + (category === "student" ? "/student/login" : "/teacher/login");

    console.log(inputData);
    console.log(url);
    axios
      .post(url, inputData)
      .then((res) => {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("category", category);
        const userData = res.data;
        delete userData.token;
        console.log(userData);
        dispatch({
          type: "ADD_USERDATA",
          data: userData,
        });
        console.log(sessionStorage.getItem("token"));
        history.push(`/${category}home`);
      })
      .catch((err) => {
        console.log(err.response.message);
        alert(err.response.message);
      });
  };

  const changeUserType = (e, type) => {
    const changeBtns = document.querySelectorAll(".sign__typeBtn");
    changeBtns.forEach((btn) => {
      btn.classList.remove("sign__typeBtnActive");
    });
    e.currentTarget.classList.add("sign__typeBtnActive");
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
            <h2>MyClass</h2>
          </Link>
        </div>
        <div className="sign__form">
          <div className="sign__type">
            <button
              onClick={(e) => {
                changeUserType(e, "student");
              }}
              className="sign__typeBtn sign__typeBtnActive"
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
              name="username"
              placeholder="username"
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
