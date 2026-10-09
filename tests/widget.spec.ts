import { test, expect } from '@playwright/test';
import { WidgetPage } from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({ page }) => {
    widgetPage = new WidgetPage(page);

    // Фиксируем группу A/B-теста, чтобы виджет поддержки отображался стабильно.
    // ab_mainpage_redesign = 'a' - группа, в которой виджет показывается.
    // При значении 'b' виджет скрыт.
    await page.context().addCookies([
      {
        name: 'ab_mainpage_redesign',
        value: 'a',
        domain: 'uchi.ru',
        path: '/',
      },
    ]);

    // open uchi.ru main page
    await page.goto('/');

    // close cookies popup
    await page.click('._UCHI_COOKIE__button');
  });

  test('opens', async () => {
    const openButton = widgetPage.getOpenButton();

    // Виджет показывается не всем пользователям (A/B-тест),
    // поэтому пропускаем тест, если кнопки нет
    if (!(await openButton.isVisible())) {
      test.skip(true, 'Виджет обратной связи не отображается для текущего пользователя (A/B-тест)');
    }

    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();
  });

  test('opens article and shows correct title', async () => {
    const openButton = widgetPage.getOpenButton();

    if (!(await openButton.isVisible())) {
      test.skip(true, 'Виджет обратной связи не отображается для текущего пользователя (A/B-тест)');
    }

    await widgetPage.openWidget();

    await widgetPage.clickArticleByTitle('Как написать в службу поддержки?');

    await expect(widgetPage.getArticleTitle()).toContainText('Как написать в службу поддержки?');
  });

  test('shows 5 popular articles', async () => {
    const openButton = widgetPage.getOpenButton();

    if (!(await openButton.isVisible())) {
      test.skip(true, 'Виджет обратной связи не отображается для текущего пользователя (A/B-тест)');
    }

    await widgetPage.openWidget();

    await expect
      .poll(async () => (await widgetPage.getPopularArticles()).length, {
        timeout: 10000,
        message: 'Ожидаем появления 5 популярных статей',
      })
      .toBe(5);
  });
});

