import { test, expect } from '@playwright/test';
import { STORAGE_STATE } from './fixtures/auth-fixtures';

const authFileGerente = STORAGE_STATE.gerente

test('login como gerente', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('input[type="email"]', 'admin@email.com')
  await page.fill('input[type="password"]', '123456')
  await page.click('button[type="submit"]')

  await page.waitForURL('/dashboard')
  
  await expect(page.locator('body')).not.toContainText('Login')

  await page.context().storageState({ path: authFileGerente })
})

const authFileSuporte = STORAGE_STATE.suporte

test('login como suporte', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('input[type="email"]', 'suporte@email.com')
  await page.fill('input[type="password"]', '123456')
  await page.click('button[type="submit"]')

  await page.waitForURL('/dashboard')
  
  await expect(page.locator('body')).not.toContainText('Login')

  await page.context().storageState({ path: authFileSuporte })
})

const authFileCliente = STORAGE_STATE.cliente

test('login como cliente', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('input[type="email"]', 'cliente@email.com')
  await page.fill('input[type="password"]', '123456')
  await page.click('button[type="submit"]')

  await page.waitForURL('/')
  
  await expect(page.locator('body')).not.toContainText('Login')

  await page.context().storageState({ path: authFileCliente })
})
