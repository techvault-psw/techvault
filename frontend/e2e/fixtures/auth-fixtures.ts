import { test as base } from '@playwright/test';

export const STORAGE_STATE = {
  gerente: '../../.auth/gerente.json',
  suporte: '../../.auth/suporte.json',
  cliente: '../../.auth/cliente.json',
};

type AuthFixtures = {
  authenticatedAsGerente: void;
  authenticatedAsSuporte: void;
  authenticatedAsCliente: void;
};

export const test = base.extend<AuthFixtures>({
  authenticatedAsGerente: [
    async ({ browser }, use) => {
      const context = await browser.newContext({
        storageState: STORAGE_STATE.gerente,
      });
      await use();
      await context.close();
    },
    { auto: true },
  ],

  authenticatedAsSuporte: [
    async ({ browser }, use) => {
      const context = await browser.newContext({
        storageState: STORAGE_STATE.suporte,
      });
      await use();
      await context.close();
    },
    { auto: true },
  ],

  authenticatedAsCliente: [
    async ({ browser }, use) => {
      const context = await browser.newContext({
        storageState: STORAGE_STATE.cliente,
      });
      await use();
      await context.close();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
