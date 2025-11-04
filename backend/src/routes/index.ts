import { Router } from "express";
import { getFeedbacks } from "./feedbacks/get-feedbacks";
import { createFeedback } from "./feedbacks/create-feedback";
import { deleteFeedback } from "./feedbacks/delete-feedback";
import { updateFeedback } from "./feedbacks/update-feedback";
import { getPacotes } from "./pacotes/get-pacotes";
import { createPacote } from "./pacotes/create-pacote";
import { deletePacote } from "./pacotes/delete-pacote";
import { updatePacote } from "./pacotes/update-pacote";
import { getReservas }  from "./reservas/get-reservas";
import { createReserva } from "./reservas/create-reserva";
import { deleteReserva } from "./reservas/delete-reserva";
import { updateReserva } from "./reservas/update-reserva";  
import { confirmEntrega } from "./reservas/confirm-entrega";
import { confirmColeta } from "./reservas/confirm-coleta";
import { uploadPacoteImageRouter } from "./pacotes/upload-pacote-image";
import { cancelReserva } from "./reservas/cancel-reserva";

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

router.use(getReservas)
router.use(createReserva)
router.use(updateReserva)
router.use(deleteReserva)
router.use(confirmColeta)
router.use(confirmEntrega)
router.use(cancelReserva)

export default router