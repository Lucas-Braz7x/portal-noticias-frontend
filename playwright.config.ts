import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests require the backend API running with seed data:
 *   Clone https://github.com/Lucas-Braz7x/portal-noticias-backend && docker compose up -d
 *   yarn prisma:migrate && yarn prisma db seed && yarn start:dev
 *
 * Frontend is started automatically via webServer (or reuse existing dev server locally).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.CI ? 'yarn build && yarn start' : 'yarn dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      API_URL: process.env.API_URL ?? 'http://localhost:3000/api/v1',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001',
    },
  },
});
