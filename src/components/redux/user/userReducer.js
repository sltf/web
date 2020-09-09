import { LOG_IN, LOG_OUT } from "./userActionTypes";

const initialState = {
  isLoggedIn: false,
  userId: null,
  idToken: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId,
        idToken: action.payload.idToken,
      };
    case LOG_OUT:
      return {
        ...state,
        isLoggedIn: false,
        userId: null,
        idToken: null,
      };
    default:
      return state;
  }
};

export default reducer;
