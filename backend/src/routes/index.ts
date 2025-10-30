import { Router } from "express";
import { getFeedbacks } from "./feedbacks/get-feedbacks";
import { createFeedback } from "./feedbacks/create-feedback";
import { deleteFeedback } from "./feedbacks/delete-feedback";
import { updateFeedback } from "./feedbacks/update-feedback";

const router = Router()

router.use(getFeedbacks)
router.use(createFeedback)
router.use(updateFeedback)
router.use(deleteFeedback)

export default router