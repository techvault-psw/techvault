import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from 'zod'
import { reservas } from "../../models/reserva";
import { authValidator, roleValidator } from "../../middlewares/auth";

const router = CreateTypedRouter();

const faturamentoDiarioSchema = z.object({
    data: z.string(),
    quantidadeReservas: z.number(),
    faturamentoDia: z.number(),
});

router.get('/relatorios/financeiro', {
    schema: {
        summary: 'Get Relatório Financeiro',
        tags: ['Relatórios'],
        query: z.object({
            dataInicio: z.string(),
            dataTermino: z.string()
        }),
        response: {
            200: z.object({
                totalRecebido: z.number(),
                quantidadeReservasConcluidas: z.number(),
                valorMedioReservas: z.number(),
                dataInicio: z.string(),
                dataTermino: z.string(),
                faturamentoDiario: z.array(faturamentoDiarioSchema)
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
    const dataInicioDate = new Date(dataInicio);
    const dataTerminoDate = new Date(dataTermino);
    
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
                dataTermino: { $lte: dataTerminoDate },
                status: 'Concluída'
            }
        },
        {
            $facet: {
                totalStats: [
                    {
                        $group: {
                            _id: null,
                            totalRecebido: { $sum: '$valor' },
                            quantidadeReservas: { $sum: 1 },
                            valorMedio: { $avg: '$valor' }
                        }
                    }
                ],
                faturamentoDiario: [
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: '%Y-%m-%d',
                                    date: '$dataInicio'
                                }
                            },
                            quantidadeReservas: { $sum: 1 },
                            faturamentoDia: { $sum: '$valor' }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    }
                ]
            }
        }
    ]);

    const totalStats = result[0].totalStats[0] || {
        totalRecebido: 0,
        quantidadeReservas: 0,
        valorMedio: 0
    };

    const faturamentoDiario = result[0].faturamentoDiario.map((dia: any) => ({
        data: dia._id,
        quantidadeReservas: dia.quantidadeReservas,
        faturamentoDia: dia.faturamentoDia
    }));

    return res.status(200).send({
        totalRecebido: totalStats.totalRecebido,
        quantidadeReservasConcluidas: totalStats.quantidadeReservas,
        valorMedioReservas: Math.round(totalStats.valorMedio * 100) / 100,
        dataInicio,
        dataTermino,
        faturamentoDiario
    });
});

export const getRelatorioFinanceiro = router;
