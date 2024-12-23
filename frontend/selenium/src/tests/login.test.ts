import { createDriver } from "../utils/driver";
import { By, until, WebDriver } from "selenium-webdriver";

const URL = "http://localhost:5173";
const email = "selenium@gmail.com";
const password = "selenium@gmail.com";

describe("Login", function () {
  this.timeout(10000); // increase timeout to 10 seconds
  let driver: WebDriver;

  before(async () => {
    driver = await createDriver();
  });

  after(async () => {
    await driver.quit();
  });

  it("should log in", async () => {
    await driver.get(URL);
    const navLoginButton = await driver.findElement(
      By.xpath("//a[contains(text(), 'Login')]")
    );
    await navLoginButton.click();
    const user = await driver.findElement(By.id("username"));
    await user.clear();
    await user.sendKeys(email);
    const pass = await driver.findElement(By.id("password"));
    await pass.clear();
    await pass.sendKeys(password);

    const loginButton = await driver.findElement(
      By.xpath("//button[@type='submit']")
    );
    await loginButton.click();

    await driver.wait(until.urlIs(URL + "/learn"), 5000);

    const profile = await driver.findElement(
      By.xpath("//a[contains(text(), 'Profile')]")
    );

    if (await profile.isDisplayed()) {
      console.log("Logged in successfully");
    } else {
      throw new Error("Login failed");
    }
  });
});
