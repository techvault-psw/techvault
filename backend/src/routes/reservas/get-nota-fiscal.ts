import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { errorMessageSchema, objectIdSchema } from "../../consts/zod-schemas";
import { reservas, type PopulatedReservaSchema } from "../../models/reserva";
import { authValidator } from "../../middlewares/auth";
import PDFDocument from "pdfkit";

const router = CreateTypedRouter()

router.get('/reservas/:id/nota-fiscal', {
  schema: {
    summary: 'Get Nota Fiscal PDF',
    tags: ['Reservas'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: z.any(),
      400: errorMessageSchema,
      403: errorMessageSchema
    },
  },
}, authValidator, async (req, res) => {
  const { id } = req.params
  const user = req.user!

  const reserva = await reservas.findById(id).populate("clienteId pacoteId enderecoId") as PopulatedReservaSchema

  if (!reserva || !reserva.clienteId || !reserva.pacoteId || !reserva.enderecoId) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }

  if(user.role === 'Cliente' && user.id !== reserva.clienteId._id.toString()) {
    return res.status(403).send({
      success: false,
      message: 'Acesso não autorizado.'
    })
  }

  const doc = new PDFDocument({ margin: 50, size: 'A4' })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=nota-fiscal-${reserva._id}.pdf`)

  doc.pipe(res)

  // --- Cores e Estilos ---
  const primaryColor = '#1a1a1a'
  const secondaryColor = '#333333'
  const boxBg = '#ebecf0'
  const borderColor = '#ced4da'
  const headerBg = '#e2e6ea'

  // --- Cabeçalho ---
  // Fundo cinza no topo
  doc.rect(0, 0, 595, 120).fill(headerBg)

  // Logo / Nome da Empresa
  doc.fontSize(26).fillColor(primaryColor).font('Helvetica-Bold')
     .text('TECHVAULT', 50, 45)
  
  // Dados da NF (Direita)
  doc.fontSize(18).font('Helvetica-Bold')
     .text('NOTA FISCAL', 350, 45, { width: 195, align: 'right' })
  
  doc.fontSize(12).font('Helvetica')
     .text(`Nº ${reserva._id.toString().substring(0, 8).toUpperCase()}`, 350, 75, { width: 195, align: 'right' })
     .text(`Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 350, 90, { width: 195, align: 'right' })

  let y = 160

  // --- Caixas de Prestador e Tomador ---
  // Prestador
  doc.roundedRect(50, y, 240, 130, 5).stroke(borderColor)
  doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text('PRESTADOR DE SERVIÇOS', 65, y + 15)
  
  doc.fontSize(10).font('Helvetica').fillColor(secondaryColor)
     .text('TechVault Locações Ltda', 65, y + 40)
     .text('CNPJ: 12.345.678/0001-90', 65, y + 55)
     .text('Rua da Tecnologia, 1000', 65, y + 70)
     .text('Rio de Janeiro - RJ', 65, y + 85)
     .text('contato@techvault.com', 65, y + 100)

  // Tomador
  doc.roundedRect(305, y, 240, 130, 5).stroke(borderColor)
  doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text('TOMADOR DE SERVIÇOS', 320, y + 15)
  
  doc.fontSize(10).font('Helvetica').fillColor(secondaryColor)
     .text(reserva.clienteId.name, 320, y + 40)
     .text(reserva.clienteId.email, 320, y + 55)
     .text(reserva.clienteId.phone, 320, y + 70)

  y += 160

  // --- Tabela de Serviços ---
  
  // Cabeçalho da Tabela
  doc.rect(50, y, 495, 35).fill(boxBg)
  doc.strokeColor(borderColor).lineWidth(1)
     .moveTo(50, y).lineTo(545, y).stroke()
     .moveTo(50, y + 35).lineTo(545, y + 35).stroke()

  doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(11)
     .text('DESCRIÇÃO DO SERVIÇO', 60, y + 12)
     .text('PERÍODO', 280, y + 12)
     .text('VALOR', 450, y + 12, { align: 'right', width: 85 })

  y += 35

  // Formatador de data
  const format = (date: Date) => {
    const dia = date.toLocaleDateString('pt-BR')
    const hora = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${dia} ${hora}:${min}`
  }

  // Item 1: Pacote
  doc.font('Helvetica').fontSize(9).fillColor(secondaryColor)
  
  let itemY = y + 15
  doc.text(`Locação de Equipamento: ${reserva.pacoteId.name}`, 60, itemY, { width: 210 })
     .text(`${format(reserva.dataInicio)} até ${format(reserva.dataTermino)}`, 280, itemY, { width: 160 })
     .text(`R$ ${reserva.valor.toFixed(2)}`, 450, itemY, { align: 'right', width: 85 })

  // Linha separadora
  y += 35
  doc.moveTo(50, y).lineTo(545, y).stroke(borderColor)

  // Item 2: Taxa
  itemY = y + 15
  doc.text(`Taxa de Entrega e Retirada`, 60, itemY, { width: 210 })
     .text(`-`, 280, itemY, { width: 160 })
     .text(`R$ 40.00`, 450, itemY, { align: 'right', width: 85 })

  y += 35
  doc.moveTo(50, y).lineTo(545, y).stroke(borderColor)

  // --- Totais ---
  y += 20
  
  const total = reserva.valor + 40
  
  // Box do Total
  doc.rect(350, y, 195, 36).fill(boxBg)
  doc.rect(350, y, 195, 36).stroke(borderColor)
  
  doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(12)
     .text('VALOR TOTAL', 365, y + 12)
     .text(`R$ ${total.toFixed(2)}`, 365, y + 12, { align: 'right', width: 165 })

  // --- Informações de Entrega ---
  y += 80
  doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text('LOCAL DE ENTREGA', 50, y)
  doc.moveTo(50, y + 15).lineTo(200, y + 15).stroke(borderColor)
  
  y += 30
  doc.fontSize(11).font('Helvetica').fillColor(secondaryColor)
     .text(`${reserva.enderecoId.street}, ${reserva.enderecoId.number}`, 50, y)
     .text(`${reserva.enderecoId.neighborhood}`, 50, y + 18)
     .text(`${reserva.enderecoId.city} - ${reserva.enderecoId.state}`, 50, y + 36)
     .text(`CEP: ${reserva.enderecoId.cep}`, 50, y + 54)

  // --- Rodapé ---
  const bottomY = 730
  doc.moveTo(50, bottomY).lineTo(545, bottomY).stroke(borderColor)
  doc.fontSize(9).fillColor('#666666')
     .text('Este documento é uma representação fictícia para fins acadêmicos. Não possui valor fiscal real.', 50, bottomY + 10, { align: 'center', width: 495 })

  doc.end()
})

export const getNotaFiscal = router
