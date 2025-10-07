import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { reservasReducer } from "./reservas/slice";
import { enderecosReducer } from "./endereco/slice";
import { clienteReducer } from "./clientes/slice";
import { feedbacksReducer } from "./feedbacks/slice";
import { pacotesReducer } from "./pacotes/slice";

const clientePersistConfig = {
  key: 'clienteReducer',
  storage,
  whitelist: ['clienteAtual']
};

const rootReducer = combineReducers({
  clienteReducer: persistReducer(clientePersistConfig, clienteReducer),
  reservasReducer,
  enderecosReducer,
  feedbacksReducer,
  pacotesReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

export type InitialState = {
  status: 'not_loaded' | 'loading' | 'deleting' | 'saving' | 'loaded' | 'deleted' | 'saved' | 'failed'
  error: null | string
}

export default rootReducer
