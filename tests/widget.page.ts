import { Page } from "@playwright/test";

enum WidgetPageSelectors {
    WRAPPER = '[class^=widgetWrapper__]',
    WIDGET_BODY = '[class^=widget__]',
    HEADER_TEXT = 'header h5',
    BUTTON_OPEN = '[data-test=openWidget]',
    BUTTON_ALL_ARTICLES = '[data-test=button_all_articles]',
    BUTTON_FEEDBACK_FORM = '[data-test=button_feedback_form]',
    ARTICLE_LIST_ITEM = '[class^=popularTitle__] + ul [data-testid=article-list-item]',
    ARTICLE_TITLE = 'p[class^=title__]',
    ARTICLE_TEXT = 'div[class^=text__]',
}

export class WidgetPage {
    static selector = WidgetPageSelectors;

    constructor(protected page: Page) {}

    wrapper() {
        return this.page.locator(WidgetPage.selector.WRAPPER);
    }

    getOpenButton() {
        return this.page.locator(WidgetPage.selector.BUTTON_OPEN);
    }

    async openWidget() {
        return this.page.locator(WidgetPage.selector.BUTTON_OPEN).click();
    }

    async getPopularArticles() {
        const items = this.wrapper().locator(WidgetPage.selector.ARTICLE_LIST_ITEM);
        await items.first().waitFor({ state: 'visible', timeout: 10000 });
        return items.all();
    }

    async clickArticleByTitle(title: string) {
        return this.wrapper()
            .locator(WidgetPage.selector.ARTICLE_LIST_ITEM)
            .filter({ hasText: title })
            .click();
    }

    async clickAllArticles() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_ALL_ARTICLES).click();
    }

    async clickWriteToUs() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_FEEDBACK_FORM).click();
    }

    getHeaderTitle() {
        return this.wrapper().locator(WidgetPage.selector.HEADER_TEXT);
    }

    getArticleTitle() {
        return this.wrapper().locator(WidgetPage.selector.ARTICLE_TITLE);
    }

    getArticleText() {
        return this.wrapper().locator(WidgetPage.selector.ARTICLE_TEXT);
    }

    getWidgetBody() {
        return this.wrapper().locator(WidgetPage.selector.WIDGET_BODY);
    }
}

