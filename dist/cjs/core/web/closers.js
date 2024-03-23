"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function closers(browser) {
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    await browser.close();
}
exports.default = closers;
//# sourceMappingURL=closers.js.map