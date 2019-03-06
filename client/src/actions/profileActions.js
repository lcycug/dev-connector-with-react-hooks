import axios from "axios";

import {
  SET_PROFILE_LOADING,
  GET_PROFILE,
  CLEAR_CURRENT_PROFILE,
  CREATE_PROFILE,
  GET_ERRORS,
  GET_PROFILES
} from "./types";

export const getCurrentProfile = () => dispatch => {
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

export const setProfileLoading = () => dispatch => {
  dispatch({
    type: SET_PROFILE_LOADING
  });
};

export const clearCurrentProfile = () => dispatch => {
  dispatch({
    type: CLEAR_CURRENT_PROFILE
  });
};

export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => {
      dispatch({
        type: CREATE_PROFILE,
        payload: res.data
      });
      history.push("/dashboard");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getProfiles = () => dispatch => {
  setProfileLoading();
  axios
    .get("/api/profile/all")
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getHandleProfile = handle => dispatch => {
  setProfileLoading();
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
