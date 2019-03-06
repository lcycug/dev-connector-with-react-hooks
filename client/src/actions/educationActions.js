import { GET_ERRORS, CREATE_EDUCATION } from "./types";
import axios from "axios";

export const createEducation = (educationData, history) => dispatch => {
  axios
    .post("/api/profile/education", educationData)
    .then(res => {
      dispatch({
        type: CREATE_EDUCATION,
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
