import {
  FETCH_STATIONS_REQUEST,
  FETCH_STATIONS_SUCCESS,
  FETCH_STATIONS_FAILURE,
  UPDATE_STATION_FAILURE,
  UPDATE_STATION_REQUEST,
  UPDATE_STATION_SUCCESS,
} from "./stationActionTypes";

const initialState = {
  loading: false,
  stations: [],
  error: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STATIONS_REQUEST:
    case UPDATE_STATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_STATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        stations: action.payload,
        error: "",
      };
    case UPDATE_STATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
      };
    case FETCH_STATIONS_FAILURE:
    case UPDATE_STATION_FAILURE:
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
