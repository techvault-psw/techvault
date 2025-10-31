import { Router } from "express";
import { getFeedbacks } from "./feedbacks/get-feedbacks";
import { createFeedback } from "./feedbacks/create-feedback";
import { deleteFeedback } from "./feedbacks/delete-feedback";
import { updateFeedback } from "./feedbacks/update-feedback";
import { getPacotes } from "./pacotes/get-pacotes";
import { createPacote } from "./pacotes/create-pacote";
import { deletePacote } from "./pacotes/delete-pacote";
import { updatePacote } from "./pacotes/update-pacote";
import { uploadPacoteImageRouter } from "./pacotes/upload-pacote-image";

const router = Router()

router.use(getFeedbacks)
router.use(createFeedback)
router.use(updateFeedback)
router.use(deleteFeedback)

router.use(getPacotes)
router.use(createPacote)
router.use(updatePacote)
router.use(deletePacote)
router.use(uploadPacoteImageRouter)

export default router