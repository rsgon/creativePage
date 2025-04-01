const {By, until, Key, Actions} = require('selenium-webdriver');
const SettingsPage = require('../pages/SettingsPage');

class CreativePage extends SettingsPage {
    constructor(driver) {
        super(driver);
        this.driver = driver;
        this.logo = By.xpath('//*[contains(@src, "logo")]');
        this.creativeID = By.xpath('//*[@automation-id="demoCreativeID"]');
        this.parentFrame = By.css('iframe#viewport');
        this.adFrame = By.xpath('//*[contains(@id, "frame")]');
        this.blockedItem = By.xpath('//*[@id="swipeClicked-Portrait"]');
        this.closeAdButton = By.css('div[id^="close_"][title="Close"]');
        // Landscape banner elements
        this.landscapeScene = By.css('.banner.landscape');
        this.orderAheadButtonLandscape = By.xpath('//*[@id="cta_clickedL"]');
        this.bannerClickLandscape = By.xpath('//*[@id="bg_clickedL"]');
        // Portrait banner elements
        this.portraitScene = By.css('.banner.portrait');
        this.orderAheadButtonPortrait = By.xpath('//*[@id="cta_clickedP"]');
        this.bannerClickPortrait = By.xpath('//*[@id="bg_clickedP"]');
    }

    async switchToAdFrame() {
        await this.driver.switchTo().defaultContent();
        const parentFrame = await this.driver.findElement(this.parentFrame);
        await this.driver.switchTo().frame(parentFrame);
        const adFrame = await this.driver.findElement(this.adFrame);
        await this.driver.switchTo().frame(adFrame);
    }

    async switchToParentFrame() {
        await this.driver.switchTo().defaultContent();
        const parentFrame = await this.driver.findElement(this.parentFrame);
        await this.driver.switchTo().frame(parentFrame);
    }

    async landingPageVisible() {
        await this.switchToParentFrame()
        await this.driver.wait(until.elementIsVisible(await this.driver.findElement(this.logo)), 5000);
        return await this.driver.findElement(this.logo).isDisplayed();
    }

    async bannerVisible() {
        await this.switchToAdFrame();
        let isVisible;
        const sceneElement = await this.driver.findElement(this.portraitScene);
        if (await sceneElement.isDisplayed()) {
            await this.driver.wait(until.elementIsVisible(await this.driver.findElement(this.orderAheadButtonPortrait)), 5000);
            isVisible = await this.driver.findElement(this.orderAheadButtonPortrait).isDisplayed();
            console.log("Portrait item selected");
        } else {
            await this.driver.wait(until.elementIsVisible(await this.driver.findElement(this.orderAheadButtonLandscape)), 5000);
            isVisible = await this.driver.findElement(this.orderAheadButtonLandscape).isDisplayed();
            console.log("Landscape item selected");
        }
        return isVisible;
    }

    async clickCloseBannerButton() {
        let landscapeScene = await this.driver.findElements(this.landscapeScene);
        let portraitScene = await this.driver.findElements(this.portraitScene);
        if (landscapeScene.length > 0) {
            console.log("Landscape item selected for close");
            await this.switchToParentFrame();
            await this.driver.wait(until.elementLocated(this.closeAdButton), 3000);
        } else if (portraitScene.length > 0) {
            console.log("Portrait item selected for close");
            await this.switchToParentFrame();
            const windowSize = await this.driver.manage().window().getRect();
            const windowWidth = windowSize.width;
            const windowHeight = windowSize.height;
            // Move the mouse to the top-right corner of the page
            const actions = this.driver.actions({async: true});
            await actions.move({x: windowWidth - 10, y: 50}).click().perform();
        }
    }

    async getCurrentTabURL() {
        const windowHandles = await this.driver.getAllWindowHandles();
        await this.driver.switchTo().window(windowHandles[windowHandles.length - 1]);
        return await this.driver.getCurrentUrl();
    }

    async closeOpenedTabAndReturnToMainWindow() {
        await this.driver.close();
        const windowHandles = await this.driver.getAllWindowHandles();
        await this.driver.switchTo().window(windowHandles[0]); // Switch to the main window
    }

    async clickOnOrderAheadButton() {
        await this.switchToAdFrame();
        const sceneElement = await this.driver.findElement(this.portraitScene);
        if (await sceneElement.isDisplayed()) {
            await this.driver.wait(until.elementIsVisible(this.driver.findElement(this.orderAheadButtonPortrait)), 1000);
            await this.clickBannerButton(this.orderAheadButtonPortrait, 'Order Ahead button pressed');
        } else {
            await this.driver.wait(until.elementIsVisible(this.driver.findElement(this.orderAheadButtonLandscape)), 1000);
            await this.clickBannerButton(this.orderAheadButtonLandscape, 'Order Ahead button pressed');
        }
    }

    async clickOnBanner() {
        await this.switchToAdFrame();
        const sceneElement = await this.driver.findElement(this.portraitScene);
        if (await sceneElement.isDisplayed()) {
            await this.driver.wait(until.elementIsNotVisible(this.driver.findElement(this.blockedItem)), 10000);
            await this.clickBannerButton(this.bannerClickPortrait, 'Background click on banner');
        } else {
            await this.driver.wait(until.elementIsNotVisible(this.driver.findElement(this.blockedItem)), 10000);
            await this.clickBannerButton(this.bannerClickLandscape, 'Background click on banner');
        }
    }

    async clickBannerButton(buttonElement, consoleMessage) {
        const button = await this.driver.findElement(buttonElement);
        if (await button.isDisplayed()) {
            await this.driver.executeScript('arguments[0].scrollIntoView(true);', button);
            await button.click();
            await this.sleep(200);
            console.log(consoleMessage);
        }
    }

    async waitUntilBannerAutoClose() {
        await this.sleep(15500); // Adjust this value based on actual behavior
    }
}

module.exports = CreativePage;
