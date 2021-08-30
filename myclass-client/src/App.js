import { useEffect, useContext } from "react";
import SignInPage from "./components/SignInPage";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import StudentPage from "./components/StudentPage";
import TeacherPage from "./components/TeacherPage";
import UserContextProvider from "./context/UserContext";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASEURL;
// const studentDetailsUrl = "/student/getalldata";

function App() {
  const [userData, dispatch] = UserContextProvider();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const category = sessionStorage.getItem("category");
    if (token) {
      console.log(token);
      const getDataUrl = baseUrl + `/${category}/getalldata`;
      axios
        .get(getDataUrl, {
          headers: {
            authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          console.log(res);
          dispatch({
            type: "ADD_USERDATA",
            data: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/studenthome">
            <StudentPage />
          </Route>
          <Route path="/teacherhome">
            <TeacherPage />
          </Route>
          <Route path="/">
            <SignInPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
