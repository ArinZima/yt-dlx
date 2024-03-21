import { Browser, Page } from "puppeteer";
export declare let browser: Browser;
export declare let page: Page;
export default function crawler(verbose?: boolean, onionTor?: boolean): Promise<void>;
