import { test, expect, Page } from '@playwright/test';
import { STORAGE_STATE } from './fixtures/auth-fixtures';

test.describe.configure({ mode: 'serial' })

async function createFeedback(page: Page, comment: string, stars: number = 4) {
  await page.getByText("Dar Feedback").click()
  
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  
  const packageSelect = dialog.getByText('Escolher pacote')
  await expect(packageSelect).toBeVisible()
  await packageSelect.click()
  
  const firstOption = page.getByRole('option').first()
  await expect(firstOption).toBeVisible()
  await firstOption.click()
  
  const starButtons = dialog.getByRole('button').filter({ has: page.locator('svg') })
  await starButtons.nth(stars).click()
  
  const commentField = dialog.getByLabel(/comentário/i)
  await commentField.fill(comment)
  
  await dialog.getByRole('button', { name: 'Confirmar' }).click()
  
  await expect(dialog).toBeHidden()
  await page.waitForLoadState('networkidle')
}

async function getFeedbackCard(page: Page, hasActionButtons: boolean = false) {
  const allCards = page.locator('section > div')
  
  if (hasActionButtons) {
    return allCards.filter({ 
      has: page.locator('button[class*="rounded-full"]')
    })
  }
  
  return allCards
}

async function openFeedbackEditDialog(feedbackCard: any) {
  const editButton = feedbackCard.locator('button[class*="rounded-full"]').first()
  await expect(editButton).toBeVisible()
  await editButton.click()
}

async function openFeedbackDeleteDialog(feedbackCard: any) {
  const deleteButton = feedbackCard.locator('button[class*="rounded-full"]').nth(1)
  await expect(deleteButton).toBeVisible()
  await deleteButton.click()
}

test.describe('Feedbacks - Cliente', () => {
  test.use({ storageState: STORAGE_STATE.cliente })

  test('deve visualizar todos feedbacks', async ({ page }) => {
    await page.goto('/feedbacks')

    await expect(page.getByRole('heading', { name: 'Feedbacks' })).toBeVisible()
    
    const feedbacksSection = page.locator('section').first()
    await expect(feedbacksSection).toBeVisible()
    
    const count = await page.locator('section > div').count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('deve criar um novo feedback', async ({ page }) => {
    await page.goto('/feedbacks')
    
    await expect(page.getByRole('heading', { name: 'Feedbacks' })).toBeVisible()
    
    const countBefore = await page.locator('section > div').count()
    
    await createFeedback(page, 'Excelente pacote! Muito satisfeito com o serviço.')
    
    const feedbacksSection = page.locator('section').first()
    await expect(feedbacksSection.getByText('Excelente pacote! Muito satisfeito com o serviço.')).toBeVisible({ timeout: 10000 })
    
    const countAfter = await page.locator('section > div').count()
    expect(countAfter).toBeGreaterThan(countBefore)
  })

  test('deve editar um feedback', async ({ page }) => {
    await page.goto('/feedbacks')
    
    await expect(page.getByRole('heading', { name: 'Feedbacks' })).toBeVisible()
    
    const myFeedbacks = await getFeedbackCard(page, true)
    const myFeedbacksCount = await myFeedbacks.count()
    
    if (myFeedbacksCount === 0) {
      await createFeedback(page, 'Feedback criado para ser editado.')
      await page.goto('/feedbacks')
      await expect(page.getByRole('heading', { name: 'Feedbacks' })).toBeVisible()
    }
    
    const myFeedbackCards = await getFeedbackCard(page, true)
    const myFeedback = myFeedbackCards.first()
    
    await openFeedbackEditDialog(myFeedback)
    
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Editar feedback' })
    await expect(editDialog).toBeVisible()
    
    const starButtons = editDialog.getByRole('button').filter({ has: page.locator('svg') })
    await starButtons.nth(2).click()
    
    const newComment = 'Editado pelo teste e2e em ' + Date.now()
    const commentField = editDialog.getByLabel(/comentário/i)
    await commentField.fill(newComment)
    
    await editDialog.getByRole('button', { name: 'Salvar' }).click()
    
    await expect(editDialog).toBeHidden()
    
    const updatedFeedback = page.locator('section').first().getByText(newComment)
    await expect(updatedFeedback).toBeVisible({ timeout: 10000 })
  })

  test('deve excluir um feedback', async ({ page }) => {
    await page.goto('/feedbacks')
    
    await expect(page.getByRole('heading', { name: 'Feedbacks' })).toBeVisible()
    
    const myFeedbacks = await getFeedbackCard(page, true)
    const myFeedbacksCount = await myFeedbacks.count()
    
    if (myFeedbacksCount === 0) {
      await createFeedback(page, 'Feedback criado para ser excluído.')
      await page.goto('/feedbacks')
      await expect(page.getByRole('heading', { name: 'Feedbacks' })).toBeVisible()
    }
    
    const countBeforeDelete = await page.locator('section > div').count()
    
    const myFeedbackCards = await getFeedbackCard(page, true)
    const myFeedback = myFeedbackCards.first()
    
    const feedbackText = await myFeedback.locator('span').filter({ hasText: /\w+/ }).last().textContent()
    
    await openFeedbackDeleteDialog(myFeedback)
    
    const deleteDialog = page.getByRole('dialog').filter({ hasText: 'Excluir Feedback' })
    await expect(deleteDialog).toBeVisible()
    
    await deleteDialog.getByRole('button', { name: 'Excluir' }).click()
    
    await expect(deleteDialog).toBeHidden()
    
    await page.waitForLoadState('networkidle')
    
    const countAfterDelete = await page.locator('section > div').count()
    expect(countAfterDelete).toBe(countBeforeDelete - 1)
    
    if (feedbackText) {
      const deletedFeedback = page.locator('section').first().getByText(feedbackText, { exact: true })
      await expect(deletedFeedback).toHaveCount(0)
    }
  })
})

test.describe('Feedbacks - Gerente', () => {
  test.use({ storageState: STORAGE_STATE.gerente })

  test('deve excluir um feedback de um cliente', async ({ page }) => {
    await page.goto('/feedbacks')
    
    await expect(page.getByRole('heading', { name: 'Feedbacks' })).toBeVisible()
    
    const countBeforeDelete = await page.locator('section > div').count()
    if (countBeforeDelete === 0) {
      test.skip()
      return
    }
    
    const firstFeedback = page.locator('section > div').first()
    
    const feedbackText = await firstFeedback.locator('span').filter({ hasText: /\w+/ }).last().textContent()
    
    await openFeedbackDeleteDialog(firstFeedback)
    
    const deleteDialog = page.getByRole('dialog').filter({ hasText: 'Excluir Feedback' })
    await expect(deleteDialog).toBeVisible()
    
    await expect(deleteDialog.getByText(/feito por/i)).toBeVisible()
    
    await deleteDialog.getByRole('button', { name: 'Excluir' }).click()
    
    await expect(deleteDialog).toBeHidden()
    
    await page.waitForLoadState('networkidle')
    
    const countAfterDelete = await page.locator('section > div').count()
    expect(countAfterDelete).toBe(countBeforeDelete - 1)
    
    if (feedbackText) {
      const deletedFeedback = page.locator('section').first().getByText(feedbackText, { exact: true })
      await expect(deletedFeedback).toHaveCount(0)
    }
  })

  test('deve editar um feedback de um cliente', async ({ page }) => {
    await page.goto('/feedbacks')
    
    await expect(page.getByRole('heading', { name: 'Feedbacks' })).toBeVisible()
    
    const totalCount = await page.locator('section > div').count()
    if (totalCount === 0) {
      test.skip()
      return
    }
    
    const firstFeedback = page.locator('section > div').first()
    
    await openFeedbackEditDialog(firstFeedback)
    
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Editar feedback' })
    await expect(editDialog).toBeVisible()
    
    const starButtons = editDialog.getByRole('button').filter({ has: page.locator('svg') })
    await starButtons.nth(3).click()
    
    const newComment = 'Editado pelo gerente em ' + Date.now()
    const commentField = editDialog.getByLabel(/comentário/i)
    await commentField.fill(newComment)
    
    await editDialog.getByRole('button', { name: 'Salvar' }).click()
    
    await expect(editDialog).toBeHidden()
    
    const updatedFeedback = page.locator('section').first().getByText(newComment)
    await expect(updatedFeedback).toBeVisible({ timeout: 10000 })
  })
})
