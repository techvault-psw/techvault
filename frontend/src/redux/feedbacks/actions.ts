import type { Feedback, NewFeedback } from "./slice";

export const addFeedbackAction = (
  feedbacks: Feedback[],
  newFeedback: NewFeedback
) => {
  feedbacks.push({
    ...newFeedback,
    id: feedbacks.length,
  })
}

export const updateFeedbackAction = (
  feedbacks: Feedback[],
  updatedFeedback: Feedback,
): void => {
  const feedbackIndex = feedbacks.findIndex((feedback) => feedback.id === updatedFeedback.id)

  feedbacks.splice(feedbackIndex, 1, updatedFeedback)
}

export const deleteFeedbackAction = (feedbacks: Feedback[], id: number) => {
  const feedbackIndex = feedbacks.findIndex((feedback) => feedback.id === id)

  feedbacks.splice(feedbackIndex, 1)
}