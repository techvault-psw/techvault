import type { Feedback } from "./slice";

export const addFeedbackAction = (feedbacks: Feedback[], newFeedback: Feedback) => {
  feedbacks.push(newFeedback)

  console.log(newFeedback)
}