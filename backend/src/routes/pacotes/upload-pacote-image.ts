import { randomUUID } from "crypto";
import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { upload } from "../../utils/muler";
import { uploadImage } from "../../utils/upload-image";
import { authValidator, roleValidator } from "../../middlewares/auth";
import { errorMessageSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.post('/pacotes/upload-image', {
  schema: {
    summary: 'Upload Pacote Image',
    tags: ['Pacotes'],
    files: {
      file: { 
        required: true, 
        description: 'Imagem de um pacote',
      }
    },
    response: {
      200: z.object({
        url: z.string(),
      }),
      400: errorMessageSchema,
      500: errorMessageSchema
    },
  },
}, upload.single('file'), authValidator, roleValidator('Gerente'), async (req, res) => {
  const image = req.file!

  const { buffer, mimetype } = image

  try {
    const { url } = await uploadImage({
      body: buffer,
      name: `pacote-image-${randomUUID()}`,
      type: mimetype,
    })

    return res.status(200).send({
      url,
    });
  } catch (error) {
    console.log(error)

    return res.status(500).send({
      success: false,
      message: 'Ocorreu um erro ao realizar o upload da imagem',
    });
  }
})

export const uploadPacoteImageRouter = router