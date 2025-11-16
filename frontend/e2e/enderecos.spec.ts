import { test, expect, Page } from '@playwright/test';
import { STORAGE_STATE } from './fixtures/auth-fixtures';

test.describe.configure({ mode: 'serial' })

async function createEndereco(page: Page, name: string, cep: string = '20040-020') {
  await page.getByRole('button', { name: 'Criar endereço' }).last().click()
  
  const dialog = page.getByRole('dialog').filter({ hasText: 'Criar novo endereço' })
  await expect(dialog).toBeVisible()
  
  await dialog.getByLabel(/^nome$/i).fill(name)
  await dialog.getByLabel(/^cep$/i).fill(cep)
  
  const rua = dialog.getByLabel(/^rua$/i)
  await expect(rua).toBeEnabled({ timeout: 10000 })
  await expect(rua).not.toHaveValue('')
  
  const numero = dialog.getByLabel(/^número$/i)
  await expect(numero).toBeEnabled()
  await numero.fill('123')
  
  await dialog.getByRole('button', { name: 'Criar' }).click()
  
  await expect(dialog).toBeHidden({ timeout: 10000 })
  await page.waitForLoadState('networkidle')
}

async function getEnderecoCard(page: Page, from: 'login' | 'cliente') {
  if (from === 'login') {
    return page.locator('[data-slot="dialog-trigger"]:visible').filter({ has: page.locator('[data-slot="card-text-container"]') })
  } else {
    return page.locator('tbody [data-slot="dialog-trigger"]:visible')
  }
}

async function openEnderecoDialog(enderecoCard: any) {
  await expect(enderecoCard).toBeVisible()
  await enderecoCard.click({ clickCount: 1 })
  await enderecoCard.page().waitForTimeout(300)
}

test.describe('Endereços - Cliente', () => {
  test.use({ storageState: STORAGE_STATE.cliente })

  test('deve visualizar todos endereços', async ({ page }) => {
    await page.goto('/perfil')

    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    
    await expect(page.getByText('Endereços')).toBeVisible()
    
    const enderecosCards = await getEnderecoCard(page, 'login')
    const count = await enderecosCards.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('deve criar um novo endereço', async ({ page }) => {
    await page.goto('/perfil')
    
    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    await page.waitForLoadState('networkidle')
    
    const enderecosCards = await getEnderecoCard(page, 'login')
    const countBefore = await enderecosCards.count()
    
    const enderecoName = 'TestEnd' + Date.now()
    await createEndereco(page, enderecoName)
    
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: enderecoName })).toBeVisible({ timeout: 10000 })
    
    const enderecosCardsAfter = await getEnderecoCard(page, 'login')
    const countAfter = await enderecosCardsAfter.count()
    expect(countAfter).toBeGreaterThan(countBefore)
  })

  test('deve editar um endereço', async ({ page }) => {
    await page.goto('/perfil')
    
    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    
    const enderecosCards = await getEnderecoCard(page, 'login')
    const enderecosCount = await enderecosCards.count()
    
    if (enderecosCount === 0) {
      await createEndereco(page, 'Endereço para editar ' + Date.now())
      await page.goto('/perfil')
      await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    }
    
    const myEnderecoCards = await getEnderecoCard(page, 'login')
    const myEndereco = myEnderecoCards.first()
    
    await openEnderecoDialog(myEndereco)
    
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Dados do Endereço' })
    await expect(editDialog).toBeVisible()
    
    await page.waitForTimeout(500)
    
    const editButton = editDialog.getByRole('button', { name: 'Editar' })
    if (!await editButton.isVisible()) {
      await page.keyboard.press('Escape')
      await expect(editDialog).toBeHidden()
      await openEnderecoDialog(myEndereco)
      await expect(editDialog).toBeVisible()
      await page.waitForTimeout(500)
    }
    
    await editButton.click({ timeout: 10000 })
    
    const newName = 'Editado pelo teste e2e em ' + Date.now()
    const nameField = editDialog.getByLabel(/^nome$/i)
    await nameField.fill(newName)
    
    await editDialog.getByRole('button', { name: 'Salvar alterações' }).click()
    
    await expect(editDialog).toBeHidden()
    
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: newName })).toBeVisible({ timeout: 10000 })
  })

  test('deve excluir um endereço', async ({ page }) => {
    await page.goto('/perfil')
    
    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    
    const enderecosCards = await getEnderecoCard(page, 'login')
    const enderecosCount = await enderecosCards.count()
    
    if (enderecosCount === 0) {
      await createEndereco(page, 'Endereço para excluir ' + Date.now())
      await page.goto('/perfil')
      await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    }
    
    const enderecosCardsBeforeDelete = await getEnderecoCard(page, 'login')
    const countBeforeDelete = await enderecosCardsBeforeDelete.count()
    
    const myEnderecoCards = await getEnderecoCard(page, 'login')
    const myEndereco = myEnderecoCards.first()
    
    const enderecoText = await myEndereco.locator('[data-slot="card-title"]').textContent()
    
    await openEnderecoDialog(myEndereco)
    
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Dados do Endereço' })
    await expect(detailsDialog).toBeVisible()
    
    await page.waitForTimeout(500)
    
    const deleteButton = detailsDialog.getByRole('button', { name: 'Excluir' })
    if (!await deleteButton.isVisible()) {
      await page.keyboard.press('Escape')
      await expect(detailsDialog).toBeHidden()
      await openEnderecoDialog(myEndereco)
      await expect(detailsDialog).toBeVisible()
      await page.waitForTimeout(500)
    }
    
    await deleteButton.click()
    
    const deleteDialog = page.getByRole('dialog').filter({ hasText: 'Excluir Endereço' })
    await expect(deleteDialog).toBeVisible()
    
    await deleteDialog.getByRole('button', { name: 'Excluir' }).click()
    
    await expect(deleteDialog).toBeHidden()
    await expect(detailsDialog).toBeHidden()
    
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    const enderecosCardsAfterDelete = await getEnderecoCard(page, 'login')
    const countAfterDelete = await enderecosCardsAfterDelete.count()
    expect(countAfterDelete).toBe(countBeforeDelete - 1)
    
    if (enderecoText) {
      const deletedEndereco = page.locator('[data-slot="card-title"]').filter({ hasText: enderecoText })
      await expect(deletedEndereco).toHaveCount(0)
    }
  })
})

test.describe('Endereços - Gerente', () => {
  test.use({ storageState: STORAGE_STATE.gerente })

  test('deve visualizar os endereços de um cliente', async ({ page }) => {
    await page.goto('/clientes')
    
    await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
    await page.waitForLoadState('networkidle')
    
    const clientesCards = page.locator('tbody [data-slot="dialog-trigger"]:visible')
    const clientesCount = await clientesCards.count()
    if (clientesCount === 0) {
      test.skip()
      return
    }
    
    const firstCliente = clientesCards.first()
    await expect(firstCliente).toBeVisible()
    await firstCliente.click()
    
    await page.waitForTimeout(500)
    
    const enderecosLink = page.getByText('Ver Endereços').last()
    await expect(enderecosLink).toBeVisible({ timeout: 10000 })
    await enderecosLink.click()
    
    await page.waitForLoadState('networkidle')
    
    await expect(page.url()).toContain('/enderecos-cliente/')
    await expect(page.getByText(/^Endereços de/i)).toBeVisible()
  })

  test('deve editar um endereço de um cliente', async ({ page }) => {
    await page.goto('/clientes')
    
    await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
    await page.waitForLoadState('networkidle')
    
    const clientesCards = page.locator('tbody [data-slot="dialog-trigger"]:visible')
    const clientesCount = await clientesCards.count()
    if (clientesCount === 0) {
      test.skip()
      return
    }
    
    const firstCliente = clientesCards.first()
    await expect(firstCliente).toBeVisible()
    await firstCliente.click()
    
    await page.waitForTimeout(500)
    
    const enderecosLink = page.getByText('Ver Endereços').last()
    await expect(enderecosLink).toBeVisible({ timeout: 10000 })
    await enderecosLink.click()
    
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('tbody [data-slot="dialog-trigger"]:visible').first()).toBeVisible({ timeout: 10000 })
    
    let enderecosCards = await getEnderecoCard(page, 'cliente')
    let enderecosCount = await enderecosCards.count()
    if (enderecosCount === 0) {
      await page.waitForTimeout(3000)
      enderecosCards = await getEnderecoCard(page, 'cliente')
      enderecosCount = await enderecosCards.count()
      if (enderecosCount === 0) {
        test.skip()
        return
      }
    }
    
    const firstEndereco = enderecosCards.first()
    await openEnderecoDialog(firstEndereco)
    
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Dados do Endereço' })
    await expect(editDialog).toBeVisible()
    
    await page.waitForTimeout(500)
    
    const editButton = editDialog.getByRole('button', { name: 'Editar' })
    if (!await editButton.isVisible()) {
      await page.keyboard.press('Escape')
      await expect(editDialog).toBeHidden()
      await openEnderecoDialog(firstEndereco)
      await expect(editDialog).toBeVisible()
      await page.waitForTimeout(500)
    }
    
    await editButton.click({ timeout: 10000 })
    
    const newName = 'Editado pelo gerente em ' + Date.now()
    const nameField = editDialog.getByLabel(/^nome$/i)
    await nameField.fill(newName)
    
    await editDialog.getByRole('button', { name: 'Salvar alterações' }).click()
    
    await expect(editDialog).toBeHidden()
    
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('tbody').getByText(newName)).toBeVisible({ timeout: 10000 })
  })

  test('deve excluir um endereço de um cliente', async ({ page }) => {
    await page.goto('/clientes')
    
    await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
    await page.waitForLoadState('networkidle')
    
    const clientesCards = page.locator('tbody [data-slot="dialog-trigger"]:visible')
    const clientesCount = await clientesCards.count()
    if (clientesCount === 0) {
      test.skip()
      return
    }
    
    const firstCliente = clientesCards.first()
    await expect(firstCliente).toBeVisible()
    await firstCliente.click()
    
    await page.waitForTimeout(500)
    
    const enderecosLink = page.getByText('Ver Endereços').last()
    await expect(enderecosLink).toBeVisible({ timeout: 10000 })
    await enderecosLink.click()
    
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('tbody [data-slot="dialog-trigger"]:visible').first()).toBeVisible({ timeout: 10000 })
    
    let enderecosCards = await getEnderecoCard(page, 'cliente')
    let enderecosCount = await enderecosCards.count()
    if (enderecosCount === 0) {
      await page.waitForTimeout(3000)
      enderecosCards = await getEnderecoCard(page, 'cliente')
      enderecosCount = await enderecosCards.count()
      if (enderecosCount === 0) {
        test.skip()
        return
      }
    }
    
    const enderecosCardsBeforeDelete = await getEnderecoCard(page, 'cliente')
    const countBeforeDelete = await enderecosCardsBeforeDelete.count()
    
    const firstEndereco = enderecosCards.first()
    
    const hasCardTitle = await firstEndereco.locator('[data-slot="card-title"]').count() > 0
    const enderecoText = hasCardTitle 
      ? await firstEndereco.locator('[data-slot="card-title"]').textContent()
      : await firstEndereco.locator('td').first().textContent()
    
    await openEnderecoDialog(firstEndereco)
    
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Dados do Endereço' })
    await expect(detailsDialog).toBeVisible()
    
    await page.waitForTimeout(500)
    
    const deleteButton = detailsDialog.getByRole('button', { name: 'Excluir' })
    if (!await deleteButton.isVisible()) {
      await page.keyboard.press('Escape')
      await expect(detailsDialog).toBeHidden()
      await openEnderecoDialog(firstEndereco)
      await expect(detailsDialog).toBeVisible()
      await page.waitForTimeout(500)
    }
    
    await deleteButton.click()
    
    const deleteDialog = page.getByRole('dialog').filter({ hasText: 'Excluir Endereço' })
    await expect(deleteDialog).toBeVisible()
    
    await deleteDialog.getByRole('button', { name: 'Excluir' }).click()
    
    await expect(deleteDialog).toBeHidden()
    await expect(detailsDialog).toBeHidden()
    
    await page.waitForLoadState('networkidle')
    
    await page.locator('tbody').waitFor({ state: 'visible', timeout: 10000 })
    
    let enderecosCardsAfterDelete = await getEnderecoCard(page, 'cliente')
    let countAfterDelete = await enderecosCardsAfterDelete.count()
    if (countAfterDelete === 0) {
      await page.waitForTimeout(3000)
      enderecosCardsAfterDelete = await getEnderecoCard(page, 'cliente')
      countAfterDelete = await enderecosCardsAfterDelete.count()
    }
    expect(countAfterDelete).toBe(countBeforeDelete - 1)
    
    if (enderecoText) {
      const deletedEndereco = page.locator('tbody').getByText(enderecoText)
      await expect(deletedEndereco).toHaveCount(0)
    }
  })
})
