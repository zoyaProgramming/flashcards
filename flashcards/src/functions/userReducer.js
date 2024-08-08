const initialState = {
  user: null,
  loading: false,
  darkMode: ' light'
};
// copied from stackoverflow
// basically controls the user
exports.userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "LOADING_USER":
      return {
        ...state,
        loading: true
      };
    case "GET_USER":
      let darkVariable = ' light'
      switch(payload.dark_mode){
      case 1:
        darkVariable = ' dark'
        break;
      case 0:
        darkVariable = ' light';
        break;
      }
      return {
        ...state,
        user: payload,
        loading: false,
        darkMode: darkVariable
      };

    case "USER_ERROR":
      return {
        ...state,
        error: payload,
        user: null,
        loading: false
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        loading: false
      };
    case("SWITCH_MODE"):
    
      return{
        ...state,
        darkMode: state.darkMode===' dark'?' light':' dark'
      }
    default:
      return state;
  }
};
