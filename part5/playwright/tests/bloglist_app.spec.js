const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('when enter the application', () => {
  beforeEach (async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
	username: 'rubencar',
	password: 'secreto',
	name: 'Ruben Carbal'
      }
    });
    await request.post('http://localhost:3003/api/users', {
      data: {
	username: 'otrou',
	password: 'imposible',
	name: 'Imposter',
      }
    });

    await page.goto('http://localhost:5173');
  });

  test('the login form is display by default', async ({ page }) => {
    const locator = await page.getByText('log in to application');
    const username = await page.getByText('username');
    const password = await page.getByText('password');
    const login = await page.getByText('login');

    await expect(locator, username, password, login).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'rubencar', 'secreto');

      await expect(page.getByText('Ruben Carbal logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'rubencar', 'estenoes');

      const errorDiv = await page.locator('.error');
      await expect(errorDiv).toContainText('Wrong Credentials');
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
	await loginWith(page, 'rubencar', 'secreto');
      });

      test('a new blog can be created', async({ page }) => {
	await page.getByRole('button', { name: 'new blog' }).click();
	await expect(page.getByText('create new')).toBeVisible();
	await createBlog(page, 'new blog', 'alguien', 'algo.com');
	await expect(page.getByText('new blog alguien')).toBeVisible();
      });

      describe('when there is a blog', () => {
	beforeEach(async ({ page }) => {
	  await page.getByRole('button', { name: 'new blog' }).click();
	  await createBlog(page, 'new blog', 'alguien', 'algo.com');
	});

	test('the blog can be liked', async ({ page }) => {
	  await page.getByRole('button', { name: 'view' }).click();
	  await page.getByRole('button', { name: 'like' }).click();
	
	  await expect(page.getByText('likes 1')).toBeVisible();
	});

	test('the user can delete the blog', async ({ page }) => {
	  page.on('dialog', async dialog => {
	    await dialog.accept();
	  });

	  await page.getByRole('button', { name: 'view' }).click();
	  await page.getByRole('button', { name: 'remove' }).click();

	  await expect(page.getByText('new blog alguien')).not.toBeVisible();
	});

	test('only the user who created the blog can delete it', async ({ page }) => {
	  await page.getByRole('button', { name: 'logout' }).click();
	  await loginWith(page, 'otrou', 'imposible');
	  await page.getByRole('button', { name: 'view' }).click();

	  await expect(page.getByText('remove')).not.toBeVisible();
	});

	describe('with several blogs', () => {
	  beforeEach(async ({ page }) => {
	    await page.getByRole('button', { name: 'new blog' }).click();
	    await createBlog(page, 'otro blog', 'someone', 'otroblog.com');
	    await page.getByRole('button', { name: 'new blog' }).click();
	    await createBlog(page, 'third blog', 'another user', 'thirdblog.com');
	  });

	  test('the blogs are ordered by number of likes', async ({ page }) => {
	    await page
	      .getByText('third blog another user')
	      .getByRole('button', { name: 'view' }).click()
	    await page.getByRole('button', { name: 'like' }).click();
	    await page.getByRole('button', { name: 'hide' }).click();

	    await page
	      .getByText('otro blog someone')
	      .getByRole('button', { name: 'view' }).click()
	    await page.getByRole('button', { name: 'like' }).click();
	    await page.getByRole('button', { name: 'like' }).click();
	    await page.getByRole('button', { name: 'like' }).click();

	    const blogs = await page.locator('.blogList');
	    const first = await blogs.nth(0).locator('.likes').innerText();
	    const firstLikes = parseInt(first.split(' ')[1]);
	    const second = await blogs.nth(1).locator('.likes').innerText();
	    const secondLikes = parseInt(second.split(' ')[1]);
	    const third = await blogs.nth(2).locator('.likes').innerText();
	    const thirdLikes = parseInt(third.split(' ')[1]);

	    await expect(firstLikes).toBeGreaterThanOrEqual(secondLikes);
	    await expect(secondLikes).toBeGreaterThanOrEqual(thirdLikes);
	  });
	});
      });
    });
  });
});
