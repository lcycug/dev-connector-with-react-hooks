import { GET_ERRORS, CREATE_EXPERIENCE, GET_PROFILE } from "./types";
import axios from "axios";

export const createExperience = (experienceData, history) => dispatch => {
  axios
    .post("/api/profile/experience", experienceData)
    .then(res => {
      dispatch({
        type: CREATE_EXPERIENCE,
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

export const deleteExperience = (experienceId, expOrEdu) => dispatch => {
  const api =
    expOrEdu === "Experience"
      ? `/api/profile/experience/${experienceId}`
      : `/api/profile/education/${experienceId}`;
  axios
    .delete(api)
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
