import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import type { Pacote } from "../../consts/types";
import { pacoteZodSchema } from "../../consts/zod-schemas";
import { pacotes } from "../../models/pacote";
import { PacoteFormatter } from "../../formatters/pacote-formatter";

const router = CreateTypedRouter()

router.get('/pacotes', {
  schema: {
    summary: 'Get Pacotes',
    tags: ['Pacotes'],
    response: {
      200: z.array(pacoteZodSchema),
    },
  },
}, async (req, res) => {
  const dbPacotes = await pacotes.find({})

  const formattedPacotes = dbPacotes.map(PacoteFormatter)
  return res.status(200).send(formattedPacotes)
})

export const getPacotes = router