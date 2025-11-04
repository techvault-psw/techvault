import z from "zod";

type FileData = {
  name: string
  type: string
  body: Buffer
}

export async function uploadImage({ name, type, body }: FileData): Promise<{ url: string }> {
  const formData = new FormData()

  if (!process.env.IMGBB_API_KEY) {
    throw new Error("Variável 'IMGBB_API_KEY' não encontrada no .env")
  }

  const fileBlob = new Blob([Uint8Array.from(body)], { type })
  formData.append('image', fileBlob)
  formData.append('name', name)
  formData.append('key', process.env.IMGBB_API_KEY)

  const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  })

  const uploadData = await uploadResponse.json()

  const {
    data: { url },
  } = z
    .object({
      data: z.object({
        url: z.string().url(),
      }),
    })
    .parse(uploadData)

  return {
    url,
  }
}