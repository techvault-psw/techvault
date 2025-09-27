import { combineReducers } from "redux";
import { enderecosReducer } from "./endereco/slice";

const rootReducer = combineReducers({
    enderecosReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer