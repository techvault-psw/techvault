import { combineReducers } from "redux";
import { clienteReducer } from "./clientes/slice";
import { feedbacksReducer } from "./feedbacks/slice";

const rootReducer = combineReducers({
  clienteReducer,
  feedbacksReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer
