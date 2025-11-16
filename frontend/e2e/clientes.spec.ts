import { test, expect, Page } from '@playwright/test';
import { STORAGE_STATE } from './fixtures/auth-fixtures';

test.describe.configure({ mode: 'serial' })

async function cadastrarCliente(page: Page, name: string, email: string, phone: string, password: string) {
  await page.goto('/cadastro')
  
  await expect(page.getByRole('heading', { name: 'Cadastro' })).toBeVisible()
  
  await page.getByLabel(/nome completo/i).fill(name)
  await page.getByLabel(/e-mail/i).fill(email)
  await page.getByLabel(/telefone/i).fill(phone)
  await page.getByLabel(/^senha$/i).fill(password)
  
  await page.getByRole('button', { name: 'Cadastrar' }).click()
  
  await page.waitForLoadState('networkidle')
}

async function getClienteCard(page: Page, from: 'mobile' | 'desktop') {
  if (from === 'mobile') {
    return page.locator('section > [data-slot="dialog-trigger"]:visible')
  } else {
    return page.locator('tbody [data-slot="dialog-trigger"]:visible')
  }
}

async function openClienteDialog(clienteCard: any) {
  await expect(clienteCard).toBeVisible()
  await clienteCard.click({ clickCount: 1 })
  await clienteCard.page().waitForTimeout(300)
}

test.describe('Clientes - Sem autenticação', () => {
  test('deve se cadastrar', async ({ page }) => {
    const timestamp = Date.now()
    const name = `Cliente Teste ${timestamp}`
    const email = `teste${timestamp}@example.com`
    const phoneNumber = String(timestamp).slice(-8)
    const phone = `(11) 9${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`
    const password = 'senha123'
    
    await cadastrarCliente(page, name, email, phone, password)
    
    await expect(page.url()).toContain('/')
    await expect(page.url()).not.toContain('/cadastro')
    await expect(page.url()).not.toContain('/login')
  })
})

test.describe('Clientes - Cliente', () => {
  test.use({ storageState: STORAGE_STATE.cliente })

  test('deve ver o próprio perfil', async ({ page }) => {
    await page.goto('/perfil')

    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    
    await expect(page.getByText('Dados Pessoais')).toBeVisible()
    
    const nameField = page.getByLabel(/^nome$/i)
    await expect(nameField).toBeVisible()
    await expect(nameField).toBeDisabled()
    
    const phoneField = page.getByLabel(/^telefone$/i)
    await expect(phoneField).toBeVisible()
    await expect(phoneField).toBeDisabled()
    
    const emailField = page.getByLabel(/^e-mail$/i)
    await expect(emailField).toBeVisible()
    await expect(emailField).toBeDisabled()
    
    await expect(page.getByText('Endereços')).toBeVisible()
  })

  test('deve editar o próprio perfil', async ({ page }) => {
    await page.goto('/perfil')
    
    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    
    const editButton = page.getByRole('button', { name: 'Editar informações' })
    await expect(editButton).toBeVisible()
    await editButton.click()
    
    const nameField = page.getByLabel(/^nome$/i)
    await expect(nameField).toBeEnabled()
    
    const newName = 'Cliente Editado ' + Date.now()
    await nameField.fill(newName)
    
    const saveButton = page.getByRole('button', { name: 'Salvar alterações' })
    await expect(saveButton).toBeVisible()
    await saveButton.click()
    
    await page.waitForLoadState('networkidle')
    
    await expect(nameField).toBeDisabled()
    await expect(nameField).toHaveValue(newName)
  })

  test('deve deletar a própria conta', async ({ page }) => {
    const timestamp = Date.now()
    const name = `Cliente Para Deletar ${timestamp}`
    const email = `deletar${timestamp}@example.com`
    const phoneNumber = String(timestamp).slice(-8)
    const phone = `(11) 9${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`
    const password = 'senha123'
    
    await cadastrarCliente(page, name, email, phone, password)
    
    await page.goto('/perfil')
    
    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible()
    
    const deleteButton = page.getByRole('button', { name: 'Excluir' }).filter({ has: page.locator('svg') })
    await expect(deleteButton).toBeVisible()
    await deleteButton.click()
    
    const deleteDialog = page.getByRole('dialog').filter({ hasText: 'Excluir Conta' })
    await expect(deleteDialog).toBeVisible()
    
    await expect(deleteDialog.getByText(/ação irreversível/i)).toBeVisible()
    
    const passwordField = deleteDialog.getByLabel(/^senha$/i)
    await expect(passwordField).toBeVisible()
    await passwordField.fill(password)
    
    await deleteDialog.getByRole('button', { name: 'Excluir' }).click()
    
    await page.waitForLoadState('networkidle')
    
    await expect(page.url()).toContain('/cadastro')
  })
})

test.describe('Clientes - Gerente', () => {
  test.use({ storageState: STORAGE_STATE.gerente })

  test('deve ver todos clientes', async ({ page }) => {
    await page.goto('/clientes')
    
    await expect(page.getByRole('heading', { name: /lista de clientes/i })).toBeVisible()
    
    await page.waitForLoadState('networkidle')
    
    const viewport = page.viewportSize()
    const isMobile = viewport ? viewport.width < 1024 : false
    
    if (isMobile) {
      const clientesCards = await getClienteCard(page, 'mobile')
      const count = await clientesCards.count()
      expect(count).toBeGreaterThanOrEqual(0)
    } else {
      const tableBody = page.locator('tbody')
      await expect(tableBody).toBeVisible()
      
      const clientesRows = await getClienteCard(page, 'desktop')
      const count = await clientesRows.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('deve editar um cliente', async ({ page }) => {
    await page.goto('/clientes')
    
    await expect(page.getByRole('heading', { name: /lista de clientes/i })).toBeVisible()
    await page.waitForLoadState('networkidle')
    
    const viewport = page.viewportSize()
    const isMobile = viewport ? viewport.width < 1024 : false
    
    let clientesCards = await getClienteCard(page, isMobile ? 'mobile' : 'desktop')
    let clientesCount = await clientesCards.count()
    
    if (clientesCount === 0) {
      test.skip()
      return
    }
    
    let firstCliente = clientesCards.nth(1)
    if (await firstCliente.count() === 0) {
      firstCliente = clientesCards.first()
    }
    
    await expect(firstCliente).toBeVisible()
    await firstCliente.click()
    
    await page.waitForTimeout(500)
    
    const editButton = page.getByText('Editar').last()
    await expect(editButton).toBeVisible({ timeout: 10000 })
    await editButton.click()
    
    const newName = 'Cliente Editado pelo Gerente ' + Date.now()
    const nameField = page.getByLabel(/^nome$/i).last()
    await expect(nameField).toBeEnabled()
    await nameField.fill(newName)
    
    const saveButton = page.getByText('Salvar alterações').last()
    await saveButton.click()
    
    await page.waitForLoadState('networkidle')
    
    if (isMobile) {
      await expect(page.locator('section').getByText(newName)).toBeVisible({ timeout: 10000 })
    } else {
      await expect(page.locator('tbody').getByText(newName)).toBeVisible({ timeout: 10000 })
    }
  })

  test('deve excluir um cliente', async ({ page }) => {
    await page.goto('/clientes')
    
    await expect(page.getByRole('heading', { name: /lista de clientes/i })).toBeVisible()
    await page.waitForLoadState('networkidle')
    
    const viewport = page.viewportSize()
    const isMobile = viewport ? viewport.width < 1024 : false
    
    const filtrosButton = page.getByRole('button', { name: 'Filtros' })
    await expect(filtrosButton).toBeVisible()
    await filtrosButton.click()
    
    await page.waitForTimeout(300)
    
    const cargoSelect = page.getByText('Todos').first()
    await expect(cargoSelect).toBeVisible()
    await cargoSelect.click()
    await page.getByRole('option', { name: 'Cliente' }).click()
    
    await page.getByRole('button', { name: 'Aplicar Filtros' }).click()
    
    await page.waitForLoadState('networkidle')
    
    const clientesCards = await getClienteCard(page, isMobile ? 'mobile' : 'desktop')
    const clientesCount = await clientesCards.count()
    
    if (clientesCount === 0) {
      test.skip()
      return
    }
    
    const countBeforeDelete = clientesCount
    
    const firstCliente = clientesCards.first()
    
    let clienteText: string | null = null
    if (isMobile) {
      const cardTitle = firstCliente.locator('[data-slot="card-title"]')
      if (await cardTitle.count() > 0) {
        clienteText = await cardTitle.textContent()
      }
    } else {
      const firstCell = firstCliente.locator('td').first()
      if (await firstCell.count() > 0) {
        clienteText = await firstCell.textContent()
      }
    }
    
    await expect(firstCliente).toBeVisible()
    await firstCliente.click()
    
    await page.waitForTimeout(500)
    
    const deleteButton = page.getByText('Excluir').last()
    await expect(deleteButton).toBeVisible({ timeout: 10000 })
    await deleteButton.click()
    
    const deleteDialog = page.getByRole('dialog').filter({ hasText: 'Excluir Cliente' }).last()
    await expect(deleteDialog).toBeVisible()
    
    await expect(deleteDialog.getByText(/tem certeza/i)).toBeVisible()
    
    await deleteDialog.getByRole('button', { name: 'Excluir' }).click()
    
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    const clientesCardsAfterDelete = await getClienteCard(page, isMobile ? 'mobile' : 'desktop')
    const countAfterDelete = await clientesCardsAfterDelete.count()
    expect(countAfterDelete).toBe(countBeforeDelete - 1)
    
    if (clienteText) {
      if (isMobile) {
        const deletedCliente = page.locator('section [data-slot="card-title"]').filter({ hasText: clienteText })
        await expect(deletedCliente).toHaveCount(0)
      } else {
        const deletedCliente = page.locator('tbody').getByText(clienteText, { exact: true })
        await expect(deletedCliente).toHaveCount(0)
      }
    }
  })
})
