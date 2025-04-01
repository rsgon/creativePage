const { By, until} = require('selenium-webdriver');

class SettingsPage {
    constructor(driver) {
        this.driver = driver;
        this.devicePanel = By.xpath('//*[@id="device-panel"]');
        this.creativeID = By.xpath('//*[@automation-id="demoCreativeID"]');
        this.dropdownDevicesList = By.xpath('//*[@automation-id="settingsDevicesSelect"]');
        this.deviceWidth = By.xpath('//*[@automation-id="settingsDeviceWidth"]');
        this.deviceHeight = By.xpath('//*[@automation-id="settingsDeviceHeight"]');
        this.buttonRotateDevice = By.xpath('//*[@id="rotate-device"]');
        this.zoomOut = By.xpath('//*[@automation-id="settingsDeviceZoomOut"]');
        this.zoomIn = By.xpath('//*[@automation-id="settingsDeviceZoomIn"]');
        this.geoDataForm = By.xpath('//*[@id="queryPropsForm"]/details/summary/text()');
        this.latitudeField = By.xpath('//*[@automation-id="sf_ut_latitude"]/input');
        this.longitudeField = By.xpath('//*[@automation-id="sf_ut_longitude"]/input');
        this.zipField = By.xpath('//*[@automation-id="sf_ut_zip_code"]/input');
        this.submitGeoData = By.xpath('//*[@id="submitQueryParams"]');
        this.buttonMonitor = By.xpath('//*[@automation-id="settingsToggleMonitor"]');
        this.tableNameMonitor = By.xpath('//*[text()="Monitor"]');
        this.buttonRestartAd = By.xpath('//*[@automation-id="settingsRestartAd"]');
    }

    // Open a given URL
    async open(url) {
        await this.driver.get(url);
    }

    // Check if the device panel is visible
    async assertDevicePanelIsVisible() {
        return await this.driver.findElement(this.devicePanel).isDisplayed();
    }

    // Get list of available devices in dropdown
    async getAllDevices() {
        const dropdown = await this.driver.findElement(this.dropdownDevicesList);
        const options = await dropdown.findElements(By.tagName('option'));
        return options.map(option => option.getText());
    }

    // // Set device settings by selecting an option from the dropdown
    async setDeviceSettings(deviceName) {
        const dropdown = await this.driver.findElement(this.dropdownDevicesList);
        const options = await dropdown.findElements(By.tagName('option'));
        for (const option of options) {
            if ((await option.getText()) === deviceName) {
                await option.click();
                console.log(`${deviceName} selected as device settings`);
                return;
            }
        }
    }

    // Set device dimensions
    async setDeviceDimensions(width, height) {
        await this.setInputField(this.deviceWidth, width);
        await this.setInputField(this.deviceHeight, height);
    }

    // Rotate device if required
    async clickRotateDeviceButton(shouldRotate) {
        if (shouldRotate) {
            await this.driver.findElement(this.buttonRotateDevice).click();
        }
    }

    // Set GEO location data
    async setGeoData(latitude, longitude, zip) {
        await this.setInputField(this.latitudeField, latitude);
        await this.setInputField(this.longitudeField, longitude);
        await this.setInputField(this.zipField, zip);
    }

    // Submit GEO data form
    async clickSubmitButton() {
        await this.driver.wait(until.elementIsVisible(this.driver.findElement(this.submitGeoData)), 1000);
        await this.driver.findElement(this.submitGeoData).click();
    }

    async clickMonitorButton() {
        await this.driver.switchTo().defaultContent();
        await this.driver.findElement(this.buttonMonitor).click();
        await this.driver.wait(until.elementIsVisible(this.driver.findElement(this.tableNameMonitor)), 1000);
    }

    async clickRestartAdButton() {
        await this.driver.findElement(this.buttonRestartAd).click();
    }

    async sleep(ms) {
        await this.driver.sleep(ms);
    }

    async setInputField(selector, value) {
        const field = await this.driver.findElement(selector);
        await field.clear();
        await field.sendKeys(value);
    }

    // Get all events from monitor table
    async getEventColumnValues() {
        // Find the column index of "Event"
        const eventColumnElements = await this.driver.findElements(By.xpath("//table/thead/tr/th"));
        let eventColumnIndex = -1;
        for (let i = 0; i < eventColumnElements.length; i++) {
            let columnText = await eventColumnElements[i].getText();
            if (columnText.trim() === "Event") {
                eventColumnIndex = i + 1;
                break;
            }
        }
        // Get all values from the Event column
        const eventValues = [];
        const rows = await this.driver.findElements(By.xpath(`//table/tbody/tr`));
        for (let row of rows) {
            try {
                let cell = await row.findElement(By.xpath(`./td[${eventColumnIndex}]`));
                let text = await cell.getAttribute("textContent");
                eventValues.push(text);
            } catch (error) {
                console.warn("Skipping row due to missing cell:", error);
            }
        }
        return eventValues;
    }

    async collectEvents(allEvents, collectedEvents) {
        return allEvents.push(collectedEvents);
    }

    // Zoom functions
    async clickToZoomOut() {
        await this.driver.findElement(this.zoomOut).click();
    }

    async clickToZoomIn() {
        await this.driver.findElement(this.zoomIn).click();
    }

    // Expand GEO data form
    async expandGeoForm() {
        await this.driver.findElement(this.geoDataForm).click();
    }

    // Get Creative ID text
    async getCreativeID() {
        const text = await this.driver.findElement(this.creativeID).getText();
        const numbers = text.match(/\d+/)[0];
        console.log("Creative ID is " + numbers);
        return numbers;
    }


}

module.exports = SettingsPage;
