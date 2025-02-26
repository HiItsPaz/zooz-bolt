import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByText('Welcome Back!')).toBeVisible();
  });

  test('should allow user to login', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page).toHaveURL('/');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should allow navigation to registration', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByText('Sign up').click();
    await expect(page).toHaveURL('/auth/register');
  });
});