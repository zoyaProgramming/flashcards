const initialState = {
  user: null,
  loading: false
};
// copied from stackoverflow
// basically controls the user
export const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "LOADING_USER":
      return {
        ...state,
        loading: true
      };
    case "GET_USER":
      return {
        ...state,
        user: payload,
        loading: false
      };

    case "USER_ERROR":
      return {
        ...state,
        error: payload,
        user: null
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        loading: false
      };
    default:
      return state;
  }
};

export const auth = (state = {}, action) => {
  return state;
};