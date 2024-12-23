import { faker } from "@faker-js/faker";
import { createDriver } from "../utils/driver";
import { By, until, WebDriver } from "selenium-webdriver";

const URL = "http://localhost:5173";
const email = "selenium@gmail.com";
const password = "selenium@gmail.com";

// new set data
const title = faker.lorem.words(2);
const description = faker.lorem.words(10);
const langFrom = faker.location.countryCode();
const langTo = faker.location.countryCode();
// Generate random words
const randomNum = Math.floor(Math.random() * 10) + 2;
const words: [{ front: string; back: string }] = [] as any;
for (let i = 0; i < randomNum; i++) {
  words.push({
    front: faker.lorem.word(),
    back: faker.lorem.word(),
  });
}

describe("Create new set", function () {
  this.timeout(10000); // increase timeout to 10 seconds
  let driver: WebDriver;

  before(async () => {
    driver = await createDriver();
  });

  after(async () => {
    await driver.quit();
  });

  it("should create new set", async () => {
    await driver.get(URL);
    // Login process
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

    // New set button
    const newSetButton = await driver.findElement(By.id("createNewSet"));
    await newSetButton.click();
    await driver.wait(until.urlIs(URL + "/learn/create"), 5000);
    // Fill in the form
    const titleInput = await driver.findElement(
      By.xpath("//input[@id='title']")
    );
    await driver.wait(until.elementIsVisible(titleInput), 5000);
    await titleInput.sendKeys(title);
    const descriptionInput = await driver.findElement(By.id("description"));
    await descriptionInput.sendKeys(description);

    const langFromInput = await driver.findElement(By.id("langFrom"));
    await langFromInput.sendKeys(langFrom);
    const langToInput = await driver.findElement(By.id("langTo"));
    await langToInput.sendKeys(langTo);

    // Get the add word button
    const addWordButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Add card')]")
    );
    // Filling words
    for (let i = 0; i < words.length; i++) {
      const frontInput = await driver.findElement(By.id(`front-${i}`));
      await frontInput.sendKeys(words[i].front);
      const backInput = await driver.findElement(By.id(`back-${i}`));
      await backInput.sendKeys(words[i].back);
      await driver.wait(until.elementIsEnabled(addWordButton), 5000);
      if (i !== words.length - 1) await addWordButton.click();
    }

    // Submit the form
    const submitButton = await driver.findElement(
      By.xpath("//button[@type='submit']")
    );
    await submitButton.click();
    // Waiting for dialog to appear
    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'OK')]")),
      5000
    );
    const okButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'OK')]")
    );
    await okButton.click();

    // Check if the set is created
    await driver.wait(
      until.elementLocated(By.xpath("//h1[@id='set-title']")),
      5000
    );
    const setTitle = await driver.findElement(
      By.xpath("//h1[@id='set-title']")
    );

    await driver.wait(until.elementTextContains(setTitle, title), 5000);
    // Check if the title is displayed on the set page
    if ((await setTitle.getText()).toString().includes(title)) {
      // If the title is displayed, it was successful
      console.log("Registered successfully");
    } else {
      throw new Error("Registration failed");
    }
  });
});
