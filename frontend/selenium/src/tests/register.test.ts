import { createDriver } from "../utils/driver";
import { By, until, WebDriver } from "selenium-webdriver";
import { faker } from "@faker-js/faker";

// URL of the website
const URL = "http://localhost:5173";
// Generate random data for registration
const email = faker.internet.email();
const username = faker.internet.username();
const password = faker.internet.password();
const name = faker.person.firstName();
const surname = faker.person.lastName();

describe("Register", function () {
  this.timeout(10000); // increase timeout to 10 seconds
  let driver: WebDriver;

  before(async () => {
    driver = await createDriver();
  });

  after(async () => {
    await driver.quit();
  });

  it("should register", async () => {
    await driver.get(URL);

    // Navigate to login page
    const navLoginButton = await driver.findElement(
      By.xpath("//a[contains(text(), 'Login')]")
    );
    await navLoginButton.click();
    await driver.wait(until.urlIs(URL + "/login"), 5000);

    // Navigate to register page
    const navRegisterButton = await driver.findElement(By.tagName("a"));
    await navRegisterButton.click();
    // Get the input fields and fill them with the generated data
    const user = await driver.findElement(By.id("username"));
    await user.sendKeys(username);
    const emailInput1 = await driver.findElement(By.id("email"));
    await emailInput1.sendKeys(email);
    const pass = await driver.findElement(By.id("password"));
    await pass.sendKeys(password);
    const confirmPass = await driver.findElement(By.id("confirmPassword"));
    await confirmPass.sendKeys(password);
    const nameInput = await driver.findElement(By.id("name"));
    await nameInput.sendKeys(name);
    const surnameInput = await driver.findElement(By.id("surname"));
    await surnameInput.sendKeys(surname);
    // Click the register button
    const registerButton = await driver.findElement(
      By.xpath("//button[@type='submit']")
    );
    await registerButton.click();
    // Wait for the alert to appear and confirm it
    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'OK')]")),
      5000
    );
    const okButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'OK')]")
    );
    await okButton.click();
    // Navigate to the login page
    await driver.navigate().to(`${URL}/login`);
    await driver.wait(until.urlIs(URL + "/login"), 5000);
    // Fill the login form with the generated data
    const emailInput = await driver.findElement(By.id("username"));
    await emailInput.clear();
    await emailInput.sendKeys(email);
    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
    // Click the login button
    const loginButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign in')]")
    );
    await loginButton.click();
    // Wait for the page to change to the learn page
    await driver.wait(until.urlIs(URL + "/learn"), 5000);
    // Check if the profile button is
    const profileButton = await driver.findElement(
      By.xpath("//a[@href='/user']")
    );
    // Navigate to the profile page
    await profileButton.click();
    await driver.wait(until.urlIs(URL + "/user"), 5000);
    const profileInfo = await driver.findElement(By.id("username"));

    await driver.wait(until.elementTextContains(profileInfo, username), 5000);
    // Check if the username is displayed on the profile page
    if ((await profileInfo.getText()).toString().includes(username)) {
      // If the username is displayed, the registration was successful
      console.log("Registered successfully");
    } else {
      throw new Error("Registration failed");
    }
  });
});
