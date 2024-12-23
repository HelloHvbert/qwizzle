import { Builder, WebDriver } from "selenium-webdriver";

export async function createDriver(): Promise<WebDriver> {
  return new Builder().forBrowser("chrome").build();
}
