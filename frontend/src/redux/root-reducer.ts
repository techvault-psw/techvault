import { combineReducers } from "redux";
import { feedbacksReducer } from "./feedbacks/slice";

const rootReducer = combineReducers({
  feedbacksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
