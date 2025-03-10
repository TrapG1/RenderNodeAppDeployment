import { test, expect } from '@playwright/test';
import { loginWith, createPerson } from './helper';

test.describe('Phonebook app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Frontpage and Login form can be opened', async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users',{
      data:{
        name: 'john',
        username: 'john',
        password: '1'
      }
    })
    await expect(page.getByText('Phonebook')).toBeVisible();
    await loginWith(page, 'john', '1')
    await expect(page.getByText('Numbers')).toBeVisible();
  });

  test('Failed login', async ({page})=>{
    await loginWith(page, 'john', '2')
    await expect(page.getByText('Numbers')).not.toBeVisible();
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'john', '1')
    })

    test('a new person can be created', async ({ page }) => {
      await createPerson(page,'kolo','456')

      await expect(page.getByText('kolo')).toBeVisible()
      await page.getByRole('button', { name: 'View Number' }).click();
      await expect(page.getByText('456')).toBeVisible()
    })

    test('the person num can be changed', async ({ page }) =>{
      await createPerson(page, 'kolo', '333')
      await page.getByRole('button', { name: 'View Number' }).click();
      await expect(page.getByText('333')).toBeVisible()
    })
  }) 
});
