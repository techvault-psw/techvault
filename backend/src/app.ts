import express from 'express'
import router from './routes'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import { generateOpenAPISpec, RequestValidationError, ResponseValidationError, setDefaultResponses, setGlobalErrorHandler } from 'express-zod-openapi-typed';
import { z } from 'zod'
import mongoose from 'mongoose';

mongoose
  .connect(process.env.DB_URL || "mongodb://localhost:27017/techvault")
  .then(() => {
    console.log("🎲 Conectado ao banco!")
  }, (err) => {
    console.error(err)
  })

const app = express()

app.use(express.json())

app.use(cors())

app.use(router)

app.get('/', (req, res) => {
  return res.json({ success: true })
})

setDefaultResponses({
  422: z.object({
    success: z.boolean(),
    message: z.string(),
    errors: z.record(z.string(), z.array(z.string())),
  }),
  500: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
})

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

const swaggerSpec = generateOpenAPISpec({
  info: {
    title: 'TechVault API',
    version: '1.0.0',
  },
  servers: [{ url: BASE_URL }]
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui.css',
  customJs: [
    'https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui-bundle.js',
    'https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui-standalone-preset.js'
  ]
}));

setGlobalErrorHandler((err, req, res, next) => {
  if (err instanceof RequestValidationError) {
    return res.status(422).json({
      success: false,
      message: `Invalid ${err.segment}`,
      errors: err.fieldErrors,
    });
  }

  if (err instanceof ResponseValidationError) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.',
    });
  }
});

export default app