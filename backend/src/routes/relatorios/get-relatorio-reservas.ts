import { CreateTypedRouter } from "express-zod-openapi-typed";
import z, { boolean } from 'zod'
import { reservaExtendedZodSchema } from "../../consts/zod-schemas";
import { reservas } from "../../models/reserva";
import { PopulatedReservaFormatter } from "../../formatters/reserva-formatter";
import { authValidator, roleValidator } from "../../middlewares/auth";

const router = CreateTypedRouter();

router.get('/relatorios/reservas', {
    schema: {
        summary: 'Get Relatório Reservas',
        tags: ['Relatórios'],
        querystring: z.object({
            dataInicio: z.string(),
            dataTermino: z.string()
        }),
        response: {
            200: z.object({
                reservas: z.array(reservaExtendedZodSchema),
                qtdReservasConcluidas: z.number(),
                qtdReservasCanceladas: z.number()
            }),
            400: z.object({
                success: z.boolean(),
                message: z.string()
            }),
            401: z.object({
                success: z.boolean(),
                message: z.string()
            }),
            403: z.object({
                success: z.boolean(),
                message: z.string()
            })
        }
    }
}, authValidator, roleValidator('Gerente'), async(req, res) => {
    const { dataInicio, dataTermino } = req.query
    const dataInicioDate = new Date(dataInicio)
    const dataTerminoDate = new Date(dataTermino)

    if(dataInicioDate > dataTerminoDate) {
        return res.status(400).send({
            success: false,
            message: 'Data de início não pode ser maior que a data de término'
        })
    }

    const result = await reservas.aggregate([
        {
            $match: {
                dataInicio: { $gte: dataInicioDate },
                dataTermino: { $lte: dataTerminoDate }
            }
        },
        {
            $facet: {
                reservas: [
                    { $lookup: { from: 'clientes', localField: 'clienteId', foreignField: '_id', as: 'clienteId' } },
                    { $unwind: '$clienteId' },
                    { $lookup: { from: 'pacotes', localField: 'pacoteId', foreignField: '_id', as: 'pacoteId' } },
                    { $unwind: '$pacoteId' },
                    { $lookup: { from: 'enderecos', localField: 'enderecoId', foreignField: '_id', as: 'enderecoId' } },
                    { $unwind: '$enderecoId' },
                    { $match: { status: { $in: ['Concluída', 'Cancelada'] } } }
                ],
                qtdConcluidas: [
                    { $match: { status: 'Concluída' } },
                    { $count: 'count' }
                ],
                qtdCanceladas: [
                    { $match: { status: 'Cancelada' } },
                    { $count: 'count' }
                ]
            }
        }
    ])

    const formattedReservas = result[0].reservas.map(PopulatedReservaFormatter)
    const qtdReservasConcluidas = result[0].qtdConcluidas[0]?.count || 0
    const qtdReservasCanceladas = result[0].qtdCanceladas[0]?.count || 0

    return res.status(200).send({
        reservas: formattedReservas,
        qtdReservasConcluidas,
        qtdReservasCanceladas
    })
})

export const getRelatorioReservas = router