import { combineReducers } from "redux";
import { enderecosReducer } from "./endereco/slice";
import { clienteReducer } from "./clientes/slice";
import { feedbacksReducer } from "./feedbacks/slice";

const rootReducer = combineReducers({
  clienteReducer,
  enderecosReducer,
  feedbacksReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer
