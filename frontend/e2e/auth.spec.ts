import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('deve fazer login como gerente', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'admin@email.com')
    await page.fill('input[type="password"]', '123456')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })

  test('deve fazer login como cliente', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'cliente@email.com')
    await page.fill('input[type="password"]', '123456')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/')
  })

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'invalido@email.com')
    await page.fill('input[type="password"]', 'senhaerrada')
    await page.click('button[type="submit"]')

    await expect(page.getByText("E-mail ou Senha inválidos")).toHaveCount(2)
  })

  test('deve fazer logout', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'cliente@email.com')
    await page.fill('input[type="password"]', '123456')
    await page.click('button[type="submit"]')

    await page.getByText("Perfil").first().click()
    await page.locator('button:has-text("Sair")').nth(0).click()

    await page.locator('button:has-text("Sair")').nth(1).click()

    await expect(page).toHaveURL(/login/)
  })

  test('deve redirecionar para login quando não autenticado', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL(/login/)
  })
})
