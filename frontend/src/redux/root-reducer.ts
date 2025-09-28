import { combineReducers } from "redux";
import { reservasReducer } from "./reservas/slice";
import { enderecosReducer } from "./endereco/slice";
import { clienteReducer } from "./clientes/slice";
import { feedbacksReducer } from "./feedbacks/slice";
import { pacotesReducer } from "./pacotes/slice";

const rootReducer = combineReducers({
  clienteReducer,
  reservasReducer,
  enderecosReducer,
  feedbacksReducer,
  pacotesReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer
