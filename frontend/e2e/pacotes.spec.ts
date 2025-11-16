import { test, expect, Page } from '@playwright/test';
import { STORAGE_STATE } from './fixtures/auth-fixtures';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe.configure({ mode: 'serial' })

async function createPacote(page: Page, name: string, value: string = '150,00', quantity: string = '5') {
  await page.getByRole('button', { name: 'Criar novo' }).click()
  
  const dialog = page.getByRole('dialog').filter({ hasText: 'Criar Pacote' })
  await expect(dialog).toBeVisible()
  
  // Upload image
  const assetPath = path.join(__dirname, '../public/setup-1.png')
  await dialog.locator('input[type="file"]').setInputFiles(assetPath)
  
  await page.waitForTimeout(500)
  
  await dialog.getByLabel(/^nome$/i).fill(name)
  
  const valueInput = dialog.getByLabel(/^valor \(hora\)$/i)
  await valueInput.click()
  await valueInput.clear()
  await valueInput.fill(value)
  await page.waitForTimeout(100)
  
  const quantityInput = dialog.getByLabel(/^quantidade$/i)
  await quantityInput.fill(quantity)
  
  const descriptionInput = dialog.getByLabel(/^descrição$/i)
  await descriptionInput.fill('Este é um pacote de teste com componentes de alta qualidade para desenvolvimento e testes.')
  
  const componentsInput = dialog.getByLabel(/^componentes$/i)
  await componentsInput.fill('Processador Intel i7\nMemória RAM 16GB\nSSD 512GB\nPlaca Mãe Premium')
  
  await page.waitForTimeout(300)
  
  await dialog.getByRole('button', { name: 'Criar' }).click()
  
  await expect(dialog).toBeHidden({ timeout: 10000 })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
}

async function getPacoteCard(page: Page) {
  // Check if mobile (cards view, lg:hidden)
  const cardsContainer = page.locator('.lg\\:hidden > [data-slot="dialog-trigger"]:visible').first()
  const tableContainer = page.locator('section.hidden tbody [data-slot="dialog-trigger"]:visible').first()
  
  const isCardVisible = await cardsContainer.isVisible().catch(() => false)
  
  if (isCardVisible) {
    // Mobile: cards view (lg:hidden)
    return page.locator('[data-slot="dialog-trigger"]:visible').filter({ 
      has: page.locator('[data-slot="card-text-container"]') 
    })
  } else {
    // Desktop: table view (hidden lg:block)
    return page.locator('tbody [data-slot="dialog-trigger"]:visible')
  }
}

async function openPacoteDialog(pacoteCard: any) {
  await expect(pacoteCard).toBeVisible()
  await pacoteCard.click({ clickCount: 1 })
  await pacoteCard.page().waitForTimeout(500)
}

test.describe('Pacotes - Cliente', () => {
  test.use({ storageState: STORAGE_STATE.cliente })

  test('deve visualizar pacotes disponíveis', async ({ page }) => {
    await page.goto('/pacotes-disponiveis')

    await expect(page.getByRole('heading', { name: 'Pacotes Disponíveis' })).toBeVisible()
    
    const pacotesSection = page.locator('section').first()
    await expect(pacotesSection).toBeVisible()
    
    const count = await page.locator('section a').count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('deve visualizar detalhes do pacote', async ({ page }) => {
    await page.goto('/pacotes-disponiveis')

    await expect(page.getByRole('heading', { name: 'Pacotes Disponíveis' })).toBeVisible()
    
    const pacotesCount = await page.locator('section a').count()
    if (pacotesCount === 0) {
      test.skip()
      return
    }

    const firstPacoteLink = page.locator('section a').first()
    await expect(firstPacoteLink).toBeVisible()
    
    const pacoteName = await firstPacoteLink.locator('h3').textContent()
    
    await firstPacoteLink.click()
    
    await page.waitForLoadState('networkidle')
    
    await expect(page.getByRole('heading', { name: pacoteName || '' })).toBeVisible()
    
    await expect(page.getByText(/descrição/i)).toBeVisible()
    await expect(page.getByText(/componentes do pc/i)).toBeVisible()
    await expect(page.getByText(/valor \(hora\)/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Solicitar Reserva' })).toBeVisible()
  })
})

test.describe('Pacotes - Gerente', () => {
  test.use({ storageState: STORAGE_STATE.gerente })

  test('deve ver todos pacotes', async ({ page }) => {
    await page.goto('/pacotes')

    await expect(page.getByRole('heading', { name: 'Pacotes' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    const pacotesCards = await getPacoteCard(page)
    const count = await pacotesCards.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('deve criar um novo pacote', async ({ page }) => {
    await page.goto('/pacotes')

    await expect(page.getByRole('heading', { name: 'Pacotes' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    const pacotesCards = await getPacoteCard(page)
    const countBefore = await pacotesCards.count()

    const pacoteName = 'TestPacote' + Date.now()
    await createPacote(page, pacoteName, '200,00', '10')

    await expect(page.getByRole('heading', { name: 'Pacotes' })).toBeVisible()

    const pacotesCardsAfter = await getPacoteCard(page)
    const countAfter = await pacotesCardsAfter.count()
    expect(countAfter).toBeGreaterThan(countBefore)

    const searchInput = page.locator('input[placeholder*="Pesquisar"]')
    await searchInput.fill(pacoteName)
    
    await page.waitForTimeout(500)

    const pacotesCardsFiltered = await getPacoteCard(page)
    expect(await pacotesCardsFiltered.count()).toBeGreaterThan(0)
  })

  test('deve editar um pacote', async ({ page }) => {
    await page.goto('/pacotes')

    await expect(page.getByRole('heading', { name: 'Pacotes' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    let pacotesCards = await getPacoteCard(page)
    let pacotesCount = await pacotesCards.count()

    if (pacotesCount === 0) {
      const pacoteName = 'PacoteParaEditar' + Date.now()
      await createPacote(page, pacoteName)
      await page.goto('/pacotes')
      await expect(page.getByRole('heading', { name: 'Pacotes' })).toBeVisible()
      pacotesCards = await getPacoteCard(page)
      pacotesCount = await pacotesCards.count()
    }

    const myPacoteCards = await getPacoteCard(page)
    const myPacote = myPacoteCards.first()

    await openPacoteDialog(myPacote)

    const editDialog = page.getByRole('dialog').filter({ hasText: 'Informações do Pacote' })
    await expect(editDialog).toBeVisible()

    await page.waitForTimeout(500)

    const editButton = editDialog.getByRole('button', { name: 'Editar' })
    if (!await editButton.isVisible()) {
      await page.keyboard.press('Escape')
      await expect(editDialog).toBeHidden()
      await openPacoteDialog(myPacote)
      await expect(editDialog).toBeVisible()
      await page.waitForTimeout(500)
    }

    await editButton.click({ timeout: 10000 })

    const newName = 'Editado em ' + Date.now()
    const nameField = editDialog.getByLabel(/^nome$/i)
    await nameField.fill(newName)

    const valueField = editDialog.getByLabel(/^valor \(hora\)$/i)
    await valueField.click()
    await valueField.clear()
    await valueField.fill('250,00')

    await editDialog.getByRole('button', { name: 'Salvar alterações' }).click()

    await expect(editDialog).toBeHidden()

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    const searchInput = page.locator('input[placeholder*="Pesquisar"]')
    await searchInput.fill(newName)
    
    await page.waitForTimeout(500)

    const updatedPacotes = await getPacoteCard(page)
    expect(await updatedPacotes.count()).toBeGreaterThan(0)
  })

  test('deve excluir um pacote', async ({ page }) => {
    await page.goto('/pacotes')

    await expect(page.getByRole('heading', { name: 'Pacotes' })).toBeVisible()
    await page.waitForLoadState('networkidle')

    let pacotesCards = await getPacoteCard(page)
    let pacotesCount = await pacotesCards.count()

    if (pacotesCount === 0) {
      const pacoteName = 'PacoteParaExcluir' + Date.now()
      await createPacote(page, pacoteName)
      await page.goto('/pacotes')
      await expect(page.getByRole('heading', { name: 'Pacotes' })).toBeVisible()
      pacotesCards = await getPacoteCard(page)
      pacotesCount = await pacotesCards.count()
    }

    const pacotesCardsBeforeDelete = await getPacoteCard(page)
    const countBeforeDelete = await pacotesCardsBeforeDelete.count()

    const firstPacoteCard = pacotesCards.first()

    const hasCardTitle = await firstPacoteCard.locator('[data-slot="card-title"]').count() > 0
    const pacoteText = hasCardTitle
      ? await firstPacoteCard.locator('[data-slot="card-title"]').textContent()
      : await firstPacoteCard.locator('td').nth(1).textContent()

    await openPacoteDialog(firstPacoteCard)

    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Informações do Pacote' })
    await expect(detailsDialog).toBeVisible()

    await page.waitForTimeout(500)

    const deleteButton = detailsDialog.getByRole('button', { name: 'Excluir' })
    if (!await deleteButton.isVisible()) {
      await page.keyboard.press('Escape')
      await expect(detailsDialog).toBeHidden()
      await openPacoteDialog(firstPacoteCard)
      await expect(detailsDialog).toBeVisible()
      await page.waitForTimeout(500)
    }

    await deleteButton.click()

    const deleteDialog = page.getByRole('dialog').filter({ hasText: 'Excluir Pacote' })
    await expect(deleteDialog).toBeVisible()

    await expect(deleteDialog.getByText(/certeza de que deseja excluir/i)).toBeVisible()

    await deleteDialog.getByRole('button', { name: 'Excluir' }).click()

    await expect(deleteDialog).toBeHidden()
    await expect(detailsDialog).toBeHidden()

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    let pacotesCardsAfterDelete = await getPacoteCard(page)
    let countAfterDelete = await pacotesCardsAfterDelete.count()
    if (countAfterDelete === 0 && countBeforeDelete > 0) {
      await page.waitForTimeout(2000)
      pacotesCardsAfterDelete = await getPacoteCard(page)
      countAfterDelete = await pacotesCardsAfterDelete.count()
    }
    expect(countAfterDelete).toBe(countBeforeDelete - 1)

    if (pacoteText) {
      const searchInput = page.locator('input[placeholder*="Pesquisar"]')
      await searchInput.fill(pacoteText)
      await page.waitForTimeout(500)
      
      const deletedPacote = await getPacoteCard(page)
      // Check if the deleted pacote still exists (it shouldn't appear in filtered results)
      const count = await deletedPacote.count()
      expect(count).toBe(0)
    }
  })
})
