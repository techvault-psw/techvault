import { Router } from "express";
import { getCliente } from "./cliente/get-cliente";
import { createCliente } from "./cliente/create-cliente";
import { updateCliente } from "./cliente/update-cliente";
import { deleteCliente } from "./cliente/delete-cliente";
import { getEnderecos } from "./enderecos/get-enderecos";
import { createEndereco } from "./enderecos/create-endereco";
import { updateEndereco } from "./enderecos/update-endereco";
import { deleteEndereco } from "./enderecos/delete-endereco";
import { getPacotes } from "./pacotes/get-pacotes";
import { createPacote } from "./pacotes/create-pacote";
import { updatePacote } from "./pacotes/update-pacote";
import { deletePacote } from "./pacotes/delete-pacote";
import { getReservas }  from "./reservas/get-reservas";
import { createReserva } from "./reservas/create-reserva";
import { updateReserva } from "./reservas/update-reserva";  
import { deleteReserva } from "./reservas/delete-reserva";
import { confirmEntrega } from "./reservas/confirm-entrega";
import { confirmColeta } from "./reservas/confirm-coleta";
import { cancelReserva } from "./reservas/cancel-reserva";
import { uploadPacoteImageRouter } from "./pacotes/upload-pacote-image";
import { getFeedbacks } from "./feedbacks/get-feedbacks";
import { createFeedback } from "./feedbacks/create-feedback";
import { updateFeedback } from "./feedbacks/update-feedback";
import { deleteFeedback } from "./feedbacks/delete-feedback";

const router = Router()

router.use(getCliente)
router.use(createCliente)
router.use(updateCliente)
router.use(deleteCliente)

router.use(getEnderecos)
router.use(createEndereco)
router.use(updateEndereco)
router.use(deleteEndereco)

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

router.use(getFeedbacks)
router.use(createFeedback)
router.use(updateFeedback)
router.use(deleteFeedback)

export default router