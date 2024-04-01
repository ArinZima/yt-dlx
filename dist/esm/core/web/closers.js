export default async function closers(browser) {
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    await browser.close();
}
//# sourceMappingURL=closers.js.map