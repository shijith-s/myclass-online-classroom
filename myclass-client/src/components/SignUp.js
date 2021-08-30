import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../css/Sign.css";
import axios from "axios";
import UserContextProvider from "../context/UserContext";

const baseUrl = process.env.REACT_APP_BASEURL;

function SignUp() {
  const history = useHistory();
  const [state, dispatch] = UserContextProvider();
  const [category, setcategory] = useState("student");
  console.log(category);

  const signUpRequest = async (event) => {
    event.preventDefault();
    const inputData = {
      name: event.target.name.value,
      username: event.target.username.value,
      password: event.target.password.value,
    };

    const url =
      baseUrl +
      (category === "student" ? "/student/signup" : "/teacher/signup");

    console.log(inputData);
    axios
      .post(url, inputData)
      .then((res) => {
        console.log(res);
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("category", category);
        delete res.data.token;
        dispatch({
          type: "ADD_USERDATA",
          data: {
            userInfo: res.data,
            category: category,
          },
        });
        history.push(`/${category}home`);
      })
      .catch((err) => {
        console.log("some error occured");
        console.log(err.response.data.message);
        alert(err.response.data.message);
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
    <div className="signUp">
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
