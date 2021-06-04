import { combineReducers } from "redux";
import WatchListReducer from "./watchList";

export default combineReducers({
  "watch-list": WatchListReducer
});
