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

  await test.step('Navigate to the create article page', async () => {
    await homePage.clickNewArticleLink();
  });
});

test.describe('Create Article Scenarios', () => {
  test('Create an article with all required and optional fields', async () => {
    const article = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentences(2),
      body: faker.lorem.paragraphs(2),
      tag: faker.lorem.word(),
    };

    await test.step('Fill in title field', async () => {
      await createArticlePage.fillTitleField(article.title);
    });

    await test.step('Fill in description field', async () => {
      await createArticlePage.fillDescriptionField(article.description);
    });

    await test.step('Fill in body field', async () => {
      await createArticlePage.fillBodyField(article.body);
    });

    await test.step('Fill in tag field and press Enter', async () => {
      await createArticlePage.fillTagField(article.tag);
    });

    await test.step('Publish the article', async () => {
      await createArticlePage.clickPublishArticleButton();
    });

    await test.step('Verify article title is visible', async () => {
      await createArticlePage.assertArticleTitleIsVisible(article.title);
    });
  });

  test('Create an article without description', async () => {
    const article = {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(2),
      tag: faker.lorem.word(),
    };

    await test.step('Fill in title field', async () => {
      await createArticlePage.fillTitleField(article.title);
    });

    await test.step('Fill in body field', async () => {
      await createArticlePage.fillBodyField(article.body);
    });

    await test.step('Fill in tag field', async () => {
      await createArticlePage.fillTagField(article.tag);
    });

    await test.step('Click publish button', async () => {
      await createArticlePage.clickPublishArticleButton();
    });

    await test.step('Assert error message for empty description', async () => {
      await createArticlePage.assertErrorMessageContainsText(
        "Article description can't be blank",
      );
    });
  });

  test('Create an article without text body', async () => {
    const article = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentences(2),
      tag: faker.lorem.word(),
    };

    await test.step('Fill in title field', async () => {
      await createArticlePage.fillTitleField(article.title);
    });

    await test.step('Fill in description field', async () => {
      await createArticlePage.fillDescriptionField(article.description);
    });

    await test.step('Fill in tag field', async () => {
      await createArticlePage.fillTagField(article.tag);
    });

    await test.step('Click publish button', async () => {
      await createArticlePage.clickPublishArticleButton();
    });

    await test.step('Assert error message for empty body text', async () => {
      await createArticlePage.assertErrorMessageContainsText(
        "Article body can't be blank",
      );
    });
  });

  test('Create an article without tags', async () => {
    const article = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentences(2),
      body: faker.lorem.paragraphs(2),
    };

    await test.step('Fill in title field', async () => {
      await createArticlePage.fillTitleField(article.title);
    });

    await test.step('Fill in description field', async () => {
      await createArticlePage.fillDescriptionField(article.description);
    });

    await test.step('Fill in body field', async () => {
      await createArticlePage.fillBodyField(article.body);
    });

    await test.step('Publish the article', async () => {
      await createArticlePage.clickPublishArticleButton();
    });

    await test.step('Verify article is published without tags', async () => {
      await createArticlePage.assertArticleTitleIsVisible(article.title);
    });
  });
});
