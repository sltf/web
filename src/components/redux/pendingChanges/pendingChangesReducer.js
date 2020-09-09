import {
  FETCH_PENDING_CHANGES_REQUEST,
  FETCH_PENDING_CHANGES_SUCCESS,
  FETCH_PENDING_CHANGES_FAILURE,
  VOTE_PENDING_CHANGE_REQUEST,
  VOTE_PENDING_CHANGE_SUCCESS,
  VOTE_PENDING_CHANGE_FAILURE,
} from "./pendingChangesActionTypes";

const initialState = {
  loading: false,
  pendingChanges: [],
  error: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PENDING_CHANGES_REQUEST:
    case VOTE_PENDING_CHANGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_PENDING_CHANGES_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingChanges: action.payload,
        error: "",
      };
    case VOTE_PENDING_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
      };
    case FETCH_PENDING_CHANGES_FAILURE:
    case VOTE_PENDING_CHANGE_FAILURE:
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
