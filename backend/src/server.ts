import 'dotenv/config'
import app from "./app"
import { connectDatabase } from "./connect"

const PORT = process.env.PORT || 3000

async function start() {
  await connectDatabase()

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
    console.log(`📝 Documentação disponível em http://localhost:${PORT}/docs`)
  })
}

start()
