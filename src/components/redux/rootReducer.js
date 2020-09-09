import { combineReducers } from "redux";
import stationsReducer from "./stations/stationsReducer";
import trainsReducer from "./trains/trainReducer";
import userReducer from "./user/userReducer";
import pendingChangesReducer from "./pendingChanges/pendingChangesReducer";

const rootReducer = combineReducers({
  stations: stationsReducer,
  trains: trainsReducer,
  pendingChanges: pendingChangesReducer,
  auth: userReducer,
});

export default rootReducer;
