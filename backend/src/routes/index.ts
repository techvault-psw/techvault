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
import { createEndereco } from "./enderecos/create-endereco";
import { deleteEndereco } from "./enderecos/delete-endereco";
import { getEnderecos } from "./enderecos/get-enderecos";
import { updateEndereco } from "./enderecos/update-endereco";
import { getCliente } from "./cliente/get-cliente";
import { createCliente } from "./cliente/create-cliente";
import { deleteCliente } from "./cliente/delete-cliente";
import { updateCliente } from "./cliente/update-cliente";

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

router.use(createEndereco)
router.use(deleteEndereco)
router.use(getEnderecos)
router.use(updateEndereco)

router.use(getCliente)
router.use(createCliente)
router.use(updateCliente)
router.use(deleteCliente)

export default router