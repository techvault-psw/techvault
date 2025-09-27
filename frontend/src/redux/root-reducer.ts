import { combineReducers } from "redux";
import { reservasReducer } from "./reservas/slice";

const rootReducer = combineReducers({reservasReducer})

export default rootReducer