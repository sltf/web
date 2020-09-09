import axios from "axios";
import {
  FETCH_PENDING_CHANGES_REQUEST,
  FETCH_PENDING_CHANGES_SUCCESS,
  FETCH_PENDING_CHANGES_FAILURE,
  VOTE_PENDING_CHANGE_REQUEST,
  VOTE_PENDING_CHANGE_SUCCESS,
  VOTE_PENDING_CHANGE_FAILURE,
} from "./pendingChangesActionTypes";
import Config from "../../../Config";

export const fetchPendingChangesRequest = () => {
  return {
    type: FETCH_PENDING_CHANGES_REQUEST,
  };
};

const fetchPendingChangesSuccess = (pendingChanges) => {
  return {
    type: FETCH_PENDING_CHANGES_SUCCESS,
    payload: pendingChanges,
  };
};

const fetchPendingChangesFailure = (error) => {
  return {
    type: FETCH_PENDING_CHANGES_FAILURE,
    payload: error,
  };
};

export const fetchPendingChanges = (authState, page) => {
  return (dispatch) => {
    dispatch(fetchPendingChangesRequest);
    let config = authState.isLoggedIn
      ? {
          headers: {
            X_ID_TOKEN: authState.idToken,
          },
        }
      : {};
    axios
      .get(`${Config.API_HOST}/api/dataChangeRequest/list?page=${page}`, config)
      .then((response) => {
        const pendingChanges = response.data;
        dispatch(fetchPendingChangesSuccess(pendingChanges));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchPendingChangesFailure(errorMsg));
      });
  };
};

export const votePendingChangeRequest = () => {
  return {
    type: VOTE_PENDING_CHANGE_REQUEST,
  };
};

const votePendingChangeSuccess = () => {
  return {
    type: VOTE_PENDING_CHANGE_SUCCESS,
  };
};

const votePendingChangeFailure = (error) => {
  return {
    type: VOTE_PENDING_CHANGE_FAILURE,
    payload: error,
  };
};

export const votePendingChange = (itemToVote, vote, authState) => {
  return (dispatch) => {
    dispatch(votePendingChangeRequest);
    let config = {
      headers: {
        X_ID_TOKEN: authState.idToken,
      },
    };
    let body = {
      requestId: itemToVote,
      voter: "UNKNOWN",
      vote: vote,
      comment: "",
    };
    axios
      .post(`${Config.API_HOST}/api/vote/`, body, config)
      .then((response) => {
        dispatch(votePendingChangeSuccess());
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(votePendingChangeFailure(errorMsg));
      });
  };
};
