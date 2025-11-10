import { randomUUID } from "crypto";
import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservaZodSchema } from "../../consts/zod-schemas";
import { da } from "zod/v4/locales";
import { gerarCodigo } from "../../utils/gerar-codigo";
import { clientes } from "../../models/cliente";
import { pacotes } from "../../models/pacote";
import { enderecos } from "../../models/endereco";
import { reservas } from "../../models/reserva";
import { ReservaFormatter } from "../../formatters/reserva-formatter";

const router = CreateTypedRouter()

router.post('/reservas', {
  schema: {
    summary: 'Create Reserva',
    tags: ['Reservas'],
    body: reservaZodSchema.omit({
      id: true,
      codigoColeta: true,
      codigoEntrega: true,
    }),
    response: {
      201: reservaZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      })
    },
  },
}, async (req, res) => {
  const { clienteId, pacoteId, enderecoId, valor, dataInicio, dataTermino } = req.body

  const cliente = await clientes.findById(clienteId)

  if (!cliente) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  const pacote = await pacotes.findById(pacoteId)

  if (!pacote) {
    return res.status(400).send({
      success: false,
      message: 'Pacote não encontrado'
    })
  }

  const endereco = await enderecos.findById(enderecoId)

  if (!endereco) {
    return res.status(400).send({
      success: false,
      message: 'Endereço não encontrado'
    })
  }

  const inicio = new Date(dataInicio)
  const termino = new Date(dataTermino)

  if (isNaN(inicio.getTime()) || isNaN(termino.getTime())) {
    return res.status(400).send({
      success: false,
      message: 'Datas inválidas',
    })
  }

  if (inicio >= termino) {
    return res.status(400).send({
      success: false,
      message: 'A data de início deve ser anterior à data de término',
    })
  }

  const diffMs = termino.getTime() - inicio.getTime()
  const diffMinutes = diffMs / (1000 * 60)

  if (diffMinutes < 15) {
    return res.status(400).send({
      success: false,
      message: 'A reserva deve ter duração mínima de 15 minutos',
    })
  }

  const reserva = await reservas.insertOne({
    clienteId,
    pacoteId,
    enderecoId,
    valor,
    dataInicio,
    dataTermino,  
    dataEntrega: null,
    dataColeta: null,
    codigoEntrega: gerarCodigo(),
    codigoColeta: gerarCodigo(),
    status: "Confirmada" as "Confirmada",
  })

  const formattedReserva = ReservaFormatter(reserva)

  return res.status(201).send(formattedReserva)
})

export const createReserva = router