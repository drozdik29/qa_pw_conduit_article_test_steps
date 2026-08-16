import { test } from '@playwright/test';
import { SignUpPage } from '../../src/pages/SignUpPage';
import { HomePage } from '../../src/pages/HomePage';
import { CreateArticlePage } from '../../src/pages/CreateArticlePage';
import { faker } from '@faker-js/faker';

let homePage: HomePage;
let createArticlePage: CreateArticlePage;

test.beforeEach(async ({ page }) => {
  const signUpPage = new SignUpPage(page);
  homePage = new HomePage(page);
  createArticlePage = new CreateArticlePage(page);

  const user = {
    username: `${faker.person.firstName()}_${faker.person.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  await test.step('Register a new user', async () => {
    await signUpPage.open();
    await signUpPage.fillUsernameField(user.username);
    await signUpPage.fillEmailField(user.email);
    await signUpPage.fillPasswordField(user.password);
    await signUpPage.clickSignUpButton();
  });

  await test.step('Verify user is redirected to the home page', async () => {
    await homePage.assertYourFeedTabIsVisible();
  });
});

test('Create an article without required fields', async () => {
  await test.step('Navigate to the create article page', async () => {
    await homePage.clickNewArticleLink();
  });

  await test.step('Click publish button with empty fields', async () => {
    await createArticlePage.clickPublishArticleButton();
  });

  await test.step('Assert error message for empty title', async () => {
    await createArticlePage.assertErrorMessageContainsText(
      'Article title cannot be empty',
    );
  });
});
