import { GET_POSTS, GET_POST } from "../actions/types";

const initialState = {
  post: null,
  posts: null,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload
      };
    case GET_POST:
      return {
        ...state,
        post: action.payload
      };
    default:
      return state;
  }
};
