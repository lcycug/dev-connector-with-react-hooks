import React, { useState, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import NProgress from "nprogress";

import PrivateRoute from "./components/common/PrivateRoute";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import store from "./components/store";
import setAuthToken from "./utils/setAuthToken";

import Navbars from "./components/layout/Navbars";
import Footers from "./components/layout/Footers";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/dashboard/CreateProfile";
import HandleExperience from "./components/dashboard/HandleExperience";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profiles/Profile";
import Feed from "./components/post/Feed";
import "./App.css";
import CommentBox from "./components/post/CommentBox";
import Landing from "./components/layout/Landing";

if (localStorage.getItem("jwtToken")) {
  const token = localStorage.getItem("jwtToken");
  // Set axios defaults headers
  setAuthToken(token);
  // Devode token
  const decoded = jwtDecode(token);
  // Log out user if expire time is triggered
  const expireTime = decoded.exp;
  const currentTime = new Date().getTime() / 1000;
  if (expireTime < currentTime) {
    logoutUser();
  } else {
    // Set current user
    store.dispatch(setCurrentUser(decoded));
  }
}

NProgress.configure({ showSpinner: false });

function App(props) {
  const [pathname, setPathname] = useState("/");
  useEffect(() => {
    setPathname(props.location.pathname);
  });
  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return (
    <>
      <Navbars />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/profiles" component={Profiles} />
        <Route path="/profile" component={Profile} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute
          exact
          path="/dashboard/create-new-profile"
          component={CreateProfile}
        />
        <PrivateRoute
          exact
          path="/dashboard/edit-profile"
          component={CreateProfile}
        />
        <PrivateRoute
          exact
          path="/dashboard/add-experience"
          component={HandleExperience}
        />
        <PrivateRoute
          exact
          path="/dashboard/add-education"
          component={HandleExperience}
        />
        <PrivateRoute exact path="/feed" component={Feed} />
        <PrivateRoute path="/feed/post" component={CommentBox} />
      </Switch>
      <Footers />
    </>
  );
}

export default withRouter(App);
