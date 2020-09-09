import {
  UPDATE_TRAIN_FAILURE,
  UPDATE_TRAIN_REQUEST,
  UPDATE_TRAIN_SUCCESS,
} from "./trainActionTypes";

const initialState = {
  loading: false,
  error: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TRAIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case UPDATE_TRAIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
      };
    case UPDATE_TRAIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
