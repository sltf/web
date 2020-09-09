import axios from "axios";
import {
  UPDATE_TRAIN_REQUEST,
  UPDATE_TRAIN_SUCCESS,
  UPDATE_TRAIN_FAILURE,
} from "./trainActionTypes";
import Config from "../../../Config";

export const updateTrainRequest = () => {
  return {
    type: UPDATE_TRAIN_REQUEST,
  };
};

const updateTrainSuccess = () => {
  return {
    type: UPDATE_TRAIN_SUCCESS,
  };
};

const updateTrainFailure = (error) => {
  return {
    type: UPDATE_TRAIN_FAILURE,
    payload: error,
  };
};

export const updateTrain = (train, authState) => {
  return (dispatch) => {
    let config = {
      headers: {
        X_ID_TOKEN: authState.idToken,
      },
    };
    axios
      .put(`${Config.API_HOST}/api/train/${train.id}`, train, config)
      .then((response) => {
        dispatch(updateTrainSuccess());
      })
      .catch((error) => {
        dispatch(updateTrainFailure(error.message));
      });
  };
};
