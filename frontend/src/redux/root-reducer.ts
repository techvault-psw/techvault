import { combineReducers } from "redux";
import { enderecosReducer } from "./endereco/slice";
import { clienteReducer } from "./clientes/slice";

const rootReducer = combineReducers({
    clienteReducer,
    enderecosReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer