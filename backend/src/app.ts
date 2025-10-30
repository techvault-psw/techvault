import express from 'express'
import router from './routes'
import swaggerUi from 'swagger-ui-express';
import { generateOpenAPISpec, RequestValidationError, ResponseValidationError, setDefaultResponses, setGlobalErrorHandler } from 'express-zod-openapi-typed';
import { z } from 'zod'

const app = express()

app.use(express.json())

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

const swaggerSpec = generateOpenAPISpec({
  info: {
    title: 'TechVault API',
    version: '1.0.0',
  },
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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