import axios from "axios";
import {
  FETCH_STATIONS_REQUEST,
  FETCH_STATIONS_SUCCESS,
  FETCH_STATIONS_FAILURE,
  UPDATE_STATION_REQUEST,
  UPDATE_STATION_SUCCESS,
  UPDATE_STATION_FAILURE,
} from "./stationActionTypes";
import Config from "../../../Config";

export const fetchStationsRequest = () => {
  return {
    type: FETCH_STATIONS_REQUEST,
  };
};

const fetchStationsSuccess = (stations) => {
  return {
    type: FETCH_STATIONS_SUCCESS,
    payload: stations,
  };
};

const fetchStationsFailure = (error) => {
  return {
    type: FETCH_STATIONS_FAILURE,
    payload: error,
  };
};

export const updateStationRequest = () => {
  return {
    type: UPDATE_STATION_REQUEST,
  };
};

const updateStationSuccess = () => {
  return {
    type: UPDATE_STATION_SUCCESS,
  };
};

const updateStationFailure = (error) => {
  return {
    type: UPDATE_STATION_FAILURE,
    payload: error,
  };
};

export const fetchStations = () => {
  return (dispatch) => {
    dispatch(fetchStationsRequest);
    axios
      .get(`${Config.API_HOST}/api/station/list`)
      .then((response) => {
        const stations = response.data;
        dispatch(fetchStationsSuccess(stations));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchStationsFailure(errorMsg));
      });
  };
};

export const updateStation = (station, authState) => {
  return (dispatch) => {
    let config = {
      headers: {
        X_ID_TOKEN: authState.idToken,
      },
    };
    axios
      .put(`${Config.API_HOST}/api/station/${station.id}`, station, config)
      .then((response) => {
        dispatch(updateStationSuccess());
      })
      .catch((error) => {
        dispatch(updateStationFailure(error.message));
      });
  };
};
