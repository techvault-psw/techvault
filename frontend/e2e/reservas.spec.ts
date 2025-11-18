import { test, expect, Page } from '@playwright/test';
import { STORAGE_STATE } from './fixtures/auth-fixtures';

test.describe.configure({ mode: 'serial' })

async function createReserva(page: Page) {
  await page.goto('/pacotes-disponiveis')
  
  await expect(page.getByRole('heading', { name: 'Pacotes Disponíveis' })).toBeVisible()
  
  const pacotesCount = await page.locator('section a').count()
  if (pacotesCount === 0) {
    return null
  }

  const firstPacoteLink = page.locator('section a').first()
  await expect(firstPacoteLink).toBeVisible()
  
  await firstPacoteLink.click()
  
  const solicitarButton = page.getByRole('button', { name: 'Solicitar Reserva' })
  await expect(solicitarButton).toBeVisible()
  await solicitarButton.click()
  
  await page.waitForTimeout(1000)
  
  await expect(page.getByRole('heading', { name: 'Confirmar Reserva' })).toBeVisible()
  
  const dataInicialPicker = page.getByText('Selecione uma data').first()
  await expect(dataInicialPicker).toBeVisible({ timeout: 10000 })
  await dataInicialPicker.click()
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(14, 0, 0, 0)
  
  const dayButton = page.locator(`button[data-day*="/"][aria-label*="${tomorrow.getDate()}"]`).first()
  await dayButton.click()
  
  await page.waitForTimeout(300)
  
  const hourButtons = page.locator('button:has-text("14")')
  await hourButtons.last().click()
  
  await page.waitForTimeout(300)
  
  const minuteButtons = page.locator('button:has-text("00")')
  await minuteButtons.last().click()
  
  await page.keyboard.press('Escape')

  await page.waitForTimeout(300)
  
  const dataFinalPicker = page.getByText('Selecione uma data').first()
  await expect(dataFinalPicker).toBeVisible()
  await dataFinalPicker.click()
  
  const dayButtonFinal = page.locator(`button[data-day*="/"][aria-label*="${tomorrow.getDate()}"]`).first()
  await dayButtonFinal.click()
  
  await page.waitForTimeout(300)
  
  const hourButtonsFinal = page.locator('button:has-text("16")')
  await hourButtonsFinal.last().click()
  
  await page.waitForTimeout(300)
  
  const minuteButtonsFinal = page.locator('button:has-text("00")')
  await minuteButtonsFinal.last().click()
  
  await page.keyboard.press('Escape')

  await page.waitForTimeout(300)
  
  const enderecoSelect = page.getByText('Selecione um endereço').first()
  await expect(enderecoSelect).toBeVisible()
  await enderecoSelect.click()
  
  const firstEndereco = page.getByRole('option').first()
  await expect(firstEndereco).toBeVisible()
  await firstEndereco.click()
  
  const metodoSelect = page.getByText('Selecione um método').first()
  await expect(metodoSelect).toBeVisible()
  await metodoSelect.click()
  
  const pixOption = page.getByRole('option', { name: 'Pix' })
  await expect(pixOption).toBeVisible()
  await pixOption.click()
  
  const reservarButton = page.getByRole('button', { name: 'Reservar Agora' })
  await expect(reservarButton).toBeVisible()
  await reservarButton.click()
  
  await page.waitForTimeout(1000)
  
  await expect(page.getByRole('heading', { name: 'Finalizar Pagamento' })).toBeVisible()
  
  const copiarPixButton = page.getByRole('link', { name: 'Copiar Código Pix' })
  await expect(copiarPixButton).toBeVisible()
  await copiarPixButton.click()
  
  await page.waitForTimeout(500)
  
  await expect(page.getByRole('heading', { name: 'Reserva confirmada' })).toBeVisible()
  
  return true
}

async function getReservaCards(page: Page) {
  return page.locator('div a[href*="/informacoes-reserva"]')
}

test.describe('Reservas - Gerente', () => {
  test.use({ storageState: STORAGE_STATE.gerente })

  test('deve editar uma reserva', async ({ page }) => {
    await page.goto('/reservas')
    
    await expect(page.getByRole('heading', { name: 'Reservas' })).toBeVisible()
    
    await page.waitForTimeout(1000)
    
    const reservasCards = page.locator('[data-slot="dialog-trigger"]').filter({ has: page.locator('[data-slot="card-text-container"]') })
    const count = await reservasCards.count()
    
    if (count === 0) {
      test.skip()
      return
    }
    
    const firstReserva = reservasCards.first()
    await expect(firstReserva).toBeVisible()
    await firstReserva.click()
    
    await page.waitForTimeout(500)
    
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Informações da Reserva' })
    await expect(detailsDialog).toBeVisible()
    
    const editButton = detailsDialog.getByRole('button', { name: 'Editar' })
    await expect(editButton).toBeVisible()
    await editButton.click()
    
    const codigoEntregaField = detailsDialog.getByLabel(/código de entrega/i)
    await expect(codigoEntregaField).toBeEnabled()
    
    const newCodigo = 'ABC123D'
    await codigoEntregaField.fill(newCodigo)
    
    const saveButton = detailsDialog.getByRole('button', { name: 'Salvar alterações' })
    await expect(saveButton).toBeVisible()
    await saveButton.click()
    
    await page.waitForTimeout(2000)
    
    await firstReserva.click()
    
    await page.waitForTimeout(500)
    
    const detailsDialogAfter = page.getByRole('dialog').filter({ hasText: 'Informações da Reserva' })
    await expect(detailsDialogAfter).toBeVisible()
    
    const codigoEntregaFieldAfter = detailsDialogAfter.getByLabel(/código de entrega/i)
    await expect(codigoEntregaFieldAfter).toBeDisabled()
    await expect(codigoEntregaFieldAfter).toHaveValue(newCodigo)
  })
})

test.describe('Reservas - Suporte', () => {
  test('deve visualizar todas reservas', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/login')
    
    const emailInput = page.getByLabel(/e-mail/i)
    await emailInput.fill('suporte@email.com')
    
    const passwordInput = page.getByLabel(/senha/i)
    await passwordInput.fill('123456')
    
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForTimeout(1000)
    
    await page.goto('/reservas')
    
    await expect(page.getByRole('heading', { name: 'Reservas' })).toBeVisible()
  })

  test('deve confirmar entrega de uma reserva', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/login')
    
    let emailInput = page.getByLabel(/e-mail/i)
    await emailInput.fill('cliente@email.com')
    
    let passwordInput = page.getByLabel(/senha/i)
    await passwordInput.fill('123456')
    
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForTimeout(1000)
    
    await page.goto('/minhas-reservas')
    
    await expect(page.getByRole('heading', { name: 'Minhas Reservas' })).toBeVisible()
    
    const filtrosButton = page.getByRole('button', { name: 'Filtros' })
    await expect(filtrosButton).toBeVisible()
    await filtrosButton.click()
    
    await page.waitForTimeout(300)
    
    const statusSelect = page.getByText('Todas').first()
    await expect(statusSelect).toBeVisible()
    await statusSelect.click()
    await page.getByRole('option', { name: 'Confirmada' }).click()
    
    await page.getByRole('button', { name: 'Aplicar Filtros' }).click()
    
    await page.waitForTimeout(500)
    
    const reservasCards = await getReservaCards(page)
    const count = await reservasCards.count()
    
    if (count === 0) {
      test.skip()
      return
    }
    
    const firstReserva = reservasCards.first()
    await expect(firstReserva).toBeVisible()
    
    const pacoteNome = await firstReserva.locator('h2').textContent()
    
    await firstReserva.click()
    
    await page.waitForTimeout(500)
    
    await expect(page.getByRole('heading', { name: 'Reserva' })).toBeVisible()
    
    const codigoEntregaBox = page.locator('div').filter({ hasText: /^Código para entrega:/ }).locator('div').filter({ hasText: /^[A-Z0-9]{7}$/ }).first()
    const codigoEntrega = await codigoEntregaBox.textContent()
    
    await page.goto('/login')
    
    emailInput = page.getByLabel(/e-mail/i)
    await emailInput.fill('suporte@email.com')
    
    passwordInput = page.getByLabel(/senha/i)
    await passwordInput.fill('123456')
    
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForTimeout(1000)
    
    await page.goto('/reservas')
    
    await expect(page.getByRole('heading', { name: 'Reservas' })).toBeVisible()
    
    await page.waitForTimeout(1000)
    
    const reservaCard = page.locator('[data-slot="dialog-trigger"]').filter({ 
      has: page.locator('[data-slot="card-text-container"]:has(span:has-text("Entrega"))')
    }).filter({ hasText: pacoteNome || '' }).first()
    
    const cardCount = await reservaCard.count()
    if (cardCount === 0) {
      test.skip()
      return
    }
    
    await expect(reservaCard).toBeVisible()
    await reservaCard.click()
    
    await page.waitForTimeout(500)
    
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Informações da Reserva' })
    await expect(detailsDialog).toBeVisible()
    
    const confirmarEntregaButton = detailsDialog.getByRole('button', { name: 'Confirmar Entrega' })
    await expect(confirmarEntregaButton).toBeVisible()
    await confirmarEntregaButton.click()
    
    const confirmarDialog = page.getByRole('dialog').filter({ hasText: 'Insira o Código' }).last()
    await expect(confirmarDialog).toBeVisible()
    
    const codeInput = confirmarDialog.getByLabel(/código de entrega/i)
    await expect(codeInput).toBeVisible()
    await codeInput.fill(codigoEntrega || '')
    
    const confirmarButton = confirmarDialog.getByRole('button', { name: 'Confirmar' })
    await expect(confirmarButton).toBeVisible()
    await confirmarButton.click()
    
    await page.waitForTimeout(1000)
    
    const sucessoDialog = page.getByRole('dialog').filter({ hasText: 'Entrega confirmada!' })
    await expect(sucessoDialog).toBeVisible({ timeout: 10000 })
  })

  test('deve confirmar coleta de uma reserva', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/login')
    
    let emailInput = page.getByLabel(/e-mail/i)
    await emailInput.fill('cliente@email.com')
    
    let passwordInput = page.getByLabel(/senha/i)
    await passwordInput.fill('123456')
    
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForTimeout(1000)
    
    await page.goto('/minhas-reservas')
    
    await expect(page.getByRole('heading', { name: 'Minhas Reservas' })).toBeVisible()
    
    const reservasCards = await getReservaCards(page)
    const count = await reservasCards.count()
    
    if (count === 0) {
      test.skip()
      return
    }
    
    let reservaComEntrega = null
    let pacoteNomeColeta = null
    let codigoColeta = null
    
    for (let i = 0; i < count; i++) {
      const reserva = reservasCards.nth(i)
      await expect(reserva).toBeVisible()
      
      const pacoteNome = await reserva.locator('h2').textContent()
      
      await reserva.click()
      
      await page.waitForTimeout(500)
      
      await expect(page.getByRole('heading', { name: 'Reserva' })).toBeVisible()
      
      const dataEntregaInput = page.getByLabel(/data e hora de entrega/i)
      const dataEntrega = await dataEntregaInput.inputValue()
      
      if (dataEntrega && dataEntrega !== 'Não houve entrega') {
        const dataColetaInput = page.getByLabel(/data e hora de coleta/i)
        const dataColeta = await dataColetaInput.inputValue()
        
        if (!dataColeta || dataColeta === 'Não houve coleta') {
          const codigoColetaBox = page.locator('div').filter({ hasText: /^Código para coleta:/ }).locator('div').filter({ hasText: /^[A-Z0-9]{7}$/ }).last()
          codigoColeta = await codigoColetaBox.textContent()
          pacoteNomeColeta = pacoteNome
          reservaComEntrega = i
          break
        }
      }
      
      await page.goto('/minhas-reservas')
      await page.waitForTimeout(500)
    }
    
    if (reservaComEntrega === null || !codigoColeta || !pacoteNomeColeta) {
      test.skip()
      return
    }
    
    await page.goto('/login')
    
    emailInput = page.getByLabel(/e-mail/i)
    await emailInput.fill('suporte@email.com')
    
    passwordInput = page.getByLabel(/senha/i)
    await passwordInput.fill('123456')
    
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForTimeout(1000)
    
    await page.goto('/reservas')
    
    await expect(page.getByRole('heading', { name: 'Reservas' })).toBeVisible()
    
    await page.waitForTimeout(1000)
    
    const reservaCard = page.locator('[data-slot="dialog-trigger"]').filter({ 
      has: page.locator('[data-slot="card-text-container"]:has(span:has-text("Coleta"))')
    }).filter({ hasText: pacoteNomeColeta }).first()
    
    const cardCount = await reservaCard.count()
    if (cardCount === 0) {
      test.skip()
      return
    }
    
    await expect(reservaCard).toBeVisible()
    await reservaCard.click()
    
    await page.waitForTimeout(500)
    
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Informações da Reserva' })
    await expect(detailsDialog).toBeVisible()
    
    const confirmarColetaButton = detailsDialog.getByRole('button', { name: 'Confirmar Coleta' })
    await expect(confirmarColetaButton).toBeVisible()
    await confirmarColetaButton.click()
    
    const confirmarDialog = page.getByRole('dialog').filter({ hasText: 'Insira o Código' }).last()
    await expect(confirmarDialog).toBeVisible()
    
    const codeInput = confirmarDialog.getByLabel(/código de coleta/i)
    await expect(codeInput).toBeVisible()
    await codeInput.fill(codigoColeta)
    
    const confirmarButton = confirmarDialog.getByRole('button', { name: 'Confirmar' })
    await expect(confirmarButton).toBeVisible()
    await confirmarButton.click()
    
    await page.waitForTimeout(1000)
    
    const sucessoDialog = page.getByRole('dialog').filter({ hasText: 'Coleta confirmada!' })
    await expect(sucessoDialog).toBeVisible({ timeout: 10000 })
  })

  test('deve visualizar todas reservas de um cliente', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/login')
    
    const emailInput = page.getByLabel(/e-mail/i)
    await emailInput.fill('suporte@email.com')
    
    const passwordInput = page.getByLabel(/senha/i)
    await passwordInput.fill('123456')
    
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForTimeout(1000)
    
    await page.goto('/reservas')
    
    await expect(page.getByRole('heading', { name: 'Reservas' })).toBeVisible()
    
    await page.waitForTimeout(1000)
    
    const reservasCards = page.locator('[data-slot="dialog-trigger"]').filter({ 
      has: page.locator('[data-slot="card-text-container"]')
    })
    const count = await reservasCards.count()
    
    if (count === 0) {
      test.skip()
      return
    }
    
    const firstReserva = reservasCards.first()
    await expect(firstReserva).toBeVisible()
    await firstReserva.click()
    
    await page.waitForTimeout(500)
    
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Informações da Reserva' })
    await expect(detailsDialog).toBeVisible()
    
    const clienteCard = detailsDialog.locator('[data-slot="card-title"]').filter({ hasText: /.+/ }).nth(2)
    await expect(clienteCard).toBeVisible()
    await clienteCard.click()
    
    await page.waitForTimeout(500)
    
    const clienteDialog = page.getByRole('dialog').filter({ hasText: 'Dados do Cliente' })
    await expect(clienteDialog).toBeVisible()
    
    const reservasLink = clienteDialog.getByText('Ver Reservas')
    await expect(reservasLink).toBeVisible({ timeout: 10000 })
    await reservasLink.click()
    
    await page.waitForTimeout(1000)
    
    await expect(page.url()).toContain('/reservas-cliente/')
    await expect(page.getByText(/^Reservas de/i)).toBeVisible()
  })
})

test.describe('Reservas - Cliente', () => {
  test.use({ storageState: STORAGE_STATE.cliente })

  test('deve criar uma reserva', async ({ page }) => {
    const result = await createReserva(page)
    
    if (!result) {
      test.skip()
      return
    }
    
    await expect(page.getByRole('heading', { name: 'Reserva confirmada' })).toBeVisible()
    
    const codigo = page.locator('div').filter({ hasText: /^[A-Z0-9]{7}$/ }).first()
    await expect(codigo).toBeVisible()
    
    const verReservasButton = page.getByRole('link', { name: 'Ver minhas reservas' })
    await expect(verReservasButton).toBeVisible()
    await verReservasButton.click()
    
    await expect(page.getByRole('heading', { name: 'Minhas Reservas' })).toBeVisible()
  })

  test('deve visualizar suas reservas', async ({ page }) => {
    await page.goto('/minhas-reservas')

    await expect(page.getByRole('heading', { name: 'Minhas Reservas' })).toBeVisible()
    
    const reservasCards = await getReservaCards(page)
    const count = await reservasCards.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('deve visualizar uma reserva', async ({ page }) => {
    await page.goto('/minhas-reservas')
    
    await expect(page.getByRole('heading', { name: 'Minhas Reservas' })).toBeVisible()
    
    const reservasCards = await getReservaCards(page)
    const count = await reservasCards.count()
    
    if (count === 0) {
      test.skip()
      return
    }
    
    const firstReserva = reservasCards.first()
    await expect(firstReserva).toBeVisible()
    await firstReserva.click()
    
    await page.waitForTimeout(500)
    
    await expect(page.getByRole('heading', { name: 'Reserva' })).toBeVisible()
    
    await expect(page.getByLabel(/valor total pago/i)).toBeVisible()
    await expect(page.getByLabel(/endereço de entrega/i)).toBeVisible()
    await expect(page.getByLabel(/data e hora de início/i)).toBeVisible()
    await expect(page.getByLabel(/data e hora de término/i)).toBeVisible()
    
    await expect(page.getByText(/código para entrega/i)).toBeVisible()
    await expect(page.getByText(/código para coleta/i)).toBeVisible()
  })

  test('deve cancelar uma reserva', async ({ page }) => {
    await page.goto('/minhas-reservas')
    
    await expect(page.getByRole('heading', { name: 'Minhas Reservas' })).toBeVisible()

    const filtrosButton = page.getByRole('button', { name: 'Filtros' })
    await expect(filtrosButton).toBeVisible()
    await filtrosButton.click()
    
    const filtrosDialog = page.getByRole('dialog').filter({ hasText: 'Filtros de Reservas' })
    await expect(filtrosDialog).toBeVisible()
    
    await page.waitForTimeout(300)
    
    const statusSelect = filtrosDialog.getByText('Todas').first()
    await expect(statusSelect).toBeVisible()
    await statusSelect.click()

    await page.getByRole('option', { name: 'Cancelada' }).click()
    
    await page.getByRole('button', { name: 'Aplicar Filtros' }).click()
    
    await page.waitForTimeout(500)
    
    const reservasCanceladasCards = await getReservaCards(page)
    const canceladasCount = await reservasCanceladasCards.count()
    
    await filtrosButton.click()

    await page.waitForTimeout(300)
    
    const canceladaStatusSelect = filtrosDialog.getByText('Cancelada').first()
    await expect(canceladaStatusSelect).toBeVisible()
    await canceladaStatusSelect.click()
    await page.getByRole('option', { name: 'Confirmada' }).click()
    
    await page.getByRole('button', { name: 'Aplicar Filtros' }).click()
    
    await page.waitForTimeout(500)
    
    const reservasConfirmadasCards = await getReservaCards(page)
    const count = await reservasConfirmadasCards.count()
    
    if (count === 0) {
      test.skip()
      return
    }
    
    const firstReserva = reservasConfirmadasCards.first()
    await expect(firstReserva).toBeVisible()
    await firstReserva.click()
    
    await page.waitForTimeout(500)
    
    await expect(page.getByRole('heading', { name: 'Reserva' })).toBeVisible()
    
    const cancelButton = page.getByRole('button', { name: 'Cancelar' }).filter({ has: page.locator('svg') })
    await expect(cancelButton).toBeVisible()
    await cancelButton.click()
    
    const cancelDialog = page.getByRole('dialog').filter({ hasText: 'Cancelar Reserva' })
    await expect(cancelDialog).toBeVisible()
    
    await expect(cancelDialog.getByText(/tem certeza/i)).toBeVisible()
    await expect(cancelDialog.getByText(/não pode ser desfeita/i)).toBeVisible()
    
    await cancelDialog.getByRole('button', { name: 'Cancelar' }).click()
    
    await page.waitForTimeout(1000)
    
    await expect(page.url()).toContain('/minhas-reservas')
    
    await filtrosButton.click()

    await page.waitForTimeout(300)
    
    await expect(statusSelect).toBeVisible()
    await statusSelect.click()
    await page.getByRole('option', { name: 'Cancelada' }).click()
    
    await page.getByRole('button', { name: 'Aplicar Filtros' }).click()
    
    await page.waitForTimeout(500)
    
    const reservasCardsAfter = await getReservaCards(page)
    const countAfter = await reservasCardsAfter.count()
    expect(countAfter).toBe(canceladasCount + 1)
  })
})
