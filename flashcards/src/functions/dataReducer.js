const initialState = {
  data: null,
  loading: false
};
// copied from stackoverflow

// basically controls the user
export const dataReducer = (state = initialState, action) => {
  const { type, payload } = action;
  console.log('changed!!! ' + action.type)
  switch (action.type) {
    case "LOADING_DATA":
      return {
        ...state,
        loading: true
      };
    case "GET_DATA":
      return {
        ...state,
        data: payload,
        loading: false
      };

    case "DATA_ERROR":
      return {
        ...state,
        error: payload,
        data: null,
        loading: false
      };
    case "CLEAR_DATA":
      return {
        ...state,
        data: null,
        loading: false
      };
    case "UPDATE_DATE": 
    state.data[action.updateType] = payload
    return {
      ...state,
      loading: false,
      data: state.data
    }
    default:
      return state;
  }
};

