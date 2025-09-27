import { combineReducers } from "redux";
import { clienteReducer } from "./clientes/slice";

const rootReducer = combineReducers({clienteReducer})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>;