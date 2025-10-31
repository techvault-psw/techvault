import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { pacotes } from "../../consts/db-mock";
import type { Pacote } from "../../consts/types";
import { pacoteZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.get('/pacotes', {
  schema: {
    summary: 'Get Pacotes',
    tags: ['Pacotes'],
    response: {
      200: z.object({
        pacotes: z.array(pacoteZodSchema)
      }),
    },
  },
}, async (req, res) => {

  return res.status(200).send({
    pacotes,
  })
})

export const getPacotes = router