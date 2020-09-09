import { LOG_IN, LOG_OUT } from "./userActionTypes";

export const login = (userId, idToken) => {
  return {
    type: LOG_IN,
    payload: { userId: userId, idToken: idToken },
  };
};

export const logout = () => {
  return {
    type: LOG_OUT,
  };
};
