const initialState = {
  data: null,
  loading: false
};

exports.searchReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (action.type) {
    case "LOADING_SEARCH":
      return {
        ...state,
        loading: true
      };
    case "GET_SEARCH":
      return {
        ...state,
        data: payload,
        loading: false
      };

    case "SEARCH_ERROR":
      return {
        ...state,
        error: payload,
        data: null,
        loading: false
      };
    case "CLEAR_SEARCH":
      return {
        ...state,
        data: null,
        loading: false
      };
    default:
      return state;
  }
};