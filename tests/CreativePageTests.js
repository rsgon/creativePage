const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { assert } = require('chai');
const SettingsPage = require('../pages/SettingsPage');
const CreativePage = require('../pages/CreativePage');

describe('Creative Page Tests on Multiple Devices and Settings', function () {
    this.timeout(20000);

    // Configure Chrome options for headless mode
    let options = new chrome.Options();
    if (process.env.HEADLESS === 'true') {
        options.addArguments('headless'); // Run in headless mode
        options.addArguments('disable-gpu'); // Disable GPU for headless mode
        options.addArguments('no-sandbox'); // Sometimes required for running as root in Docker
        options.addArguments('window-size=1280x1024'); // Specify the window size for headless testing
    }

    let allEvents = [];
    let driver, settingsPage, creativePage;
    const creativePageURL = "https://su-p.undertone.com/125173";
    const bannerURL = "clicktag1/";
    const orderURL = "clicktag2/";

    before(async function () {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        settingsPage = new SettingsPage(driver);
        creativePage = new CreativePage(driver);
    });

    after(async function () {
        await driver.quit();
    });

    beforeEach(async function () {
        await creativePage.open(creativePageURL);
    });

    const devices = [
        // 'Custom',
        'Full Screen',
        // 'iPad Air', 'iPad Mini', 'iPad Pro',
        // 'iPhone 13', 'iPhone 14 Pro Max', 'iPhone 15',
        // 'Pixel 7', 'Samsung Galaxy S20', 'Samsung Galaxy S8+',
        // 'Surface Duo',
        // 'Surface Pro 7 1'
    ];

    const rotations = [
        // true,
        false
    ];

    const geoData = [
        { city: "empty", latitude: "", longitude: "", zip: "" },
        { city: "Kyiv", latitude: 50.450001, longitude: 30.523333, zip: "01001" }
    ];

    const testConfigurations = devices.flatMap(device =>
        rotations.flatMap(rotation =>
            geoData.map(geo => ({ device, rotation, geo }))
        )
    );

    async function setupTest({ device, rotation, geo }) {
        await settingsPage.setDeviceSettings(device);
        await settingsPage.clickRotateDeviceButton(rotation);
        await settingsPage.setGeoData(geo.latitude, geo.longitude, geo.zip);
        await settingsPage.clickSubmitButton();
    }

    testConfigurations.forEach(({ device, rotation, geo }) => {

        it(`Should load creative page on ${device}, Rotation: ${rotation}, Geo: ${geo.city}`, async function () {
            await setupTest({ device, rotation, geo });
            assert.isTrue(await creativePage.assertDevicePanelIsVisible(), 'Device panel not visible');
            assert.isTrue(await creativePage.bannerVisible(), 'Banner not visible');
            await creativePage.clickMonitorButton();
            await creativePage.collectEvents(allEvents, await creativePage.getEventColumnValues());
        });

        it(`Should open Order Ahead link on ${device}, Rotation: ${rotation}, Geo: ${geo.city}`, async function () {
            await setupTest({ device, rotation, geo });
            await creativePage.clickOnOrderAheadButton();
            assert.include(await creativePage.getCurrentTabURL(), orderURL, "Incorrect URL opened");
            await creativePage.closeOpenedTabAndReturnToMainWindow();
            await creativePage.clickMonitorButton();
            await creativePage.collectEvents(allEvents, await creativePage.getEventColumnValues());
        });

        it(`Should open banner link on ${device}, Rotation: ${rotation}, Geo: ${geo.city}`, async function () {
            await setupTest({ device, rotation, geo });
            await creativePage.clickOnBanner();
            assert.include(await creativePage.getCurrentTabURL(), bannerURL, "Incorrect URL opened");
            await creativePage.closeOpenedTabAndReturnToMainWindow();
            await creativePage.clickMonitorButton();
            await creativePage.collectEvents(allEvents, await creativePage.getEventColumnValues());
        });

        it(`Should close banner with button on ${device}, Rotation: ${rotation}, Geo: ${geo.city}`, async function () {
            await setupTest({ device, rotation, geo });
            await creativePage.clickCloseBannerButton();
            assert.isTrue(await creativePage.landingPageVisible(), 'Landing page not visible');
            await creativePage.clickMonitorButton();
            await creativePage.collectEvents(allEvents, await creativePage.getEventColumnValues());
        });

        it(`Should auto-close banner after 15s on ${device}, Rotation: ${rotation}, Geo: ${geo.city}`, async function () {
            await setupTest({ device, rotation, geo });
            await creativePage.waitUntilBannerAutoClose();
            assert.isTrue(await creativePage.landingPageVisible(), 'Landing page not visible');
            await creativePage.clickMonitorButton();
            await creativePage.collectEvents(allEvents, await creativePage.getEventColumnValues());
        });
    });

    it(`Find Creative ID`, async function () {
        assert.include(creativePageURL, await creativePage.getCreativeID(), 'Landing page not visible');
        await creativePage.clickMonitorButton();
        await creativePage.collectEvents(allEvents, await creativePage.getEventColumnValues());
    });


    it(`Prints list of all event column values`, async function () {
        await creativePage.clickMonitorButton();
        await creativePage.collectEvents(allEvents, await creativePage.getEventColumnValues());
        console.log(allEvents);
    });
});
