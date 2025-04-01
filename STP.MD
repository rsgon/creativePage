#### Software Test Plan (STP) for Creative Page
1. ## Objective
   To validate the functionality of the ad unit on the Creative Page (https://su-p.undertone.com/125173), ensuring it behaves correctly across various devices, screen sizes, and locations.

2. ## Test Scenarios
       Scenario	                    Expected Result

       Ad Display	                The ad appears after page load.
       Order Button	                Clicking the Order button opens a new tab.
       Background Click	            Clicking on the background opens a new tab.
       Ad Auto-Close	            If no interaction, the ad disappears after 15 seconds.
       Ad Close Button	            Clicking the close button removes the ad.
       Device & Screen Testing	    Ad behaves consistently across different screen sizes & devices.
       Geo-Location Testing	        Page reflects different Latitude, Longitude, Zip values.
       Monitor Events Log	        Logs all user interactions (ad close, click events, auto-close).

3. ## Device & Screen Size Testing
   We will run tests across the following devices:

Desktop:
✅ Full Screen
✅ Custom Screen Size

Tablets:
✅ iPad Air
✅ iPad Mini
✅ iPad Pro

Phones:
✅ iPhone 13
✅ iPhone 14 Pro Max
✅ iPhone 15
✅ Pixel 7
✅ Samsung Galaxy S20
✅ Samsung Galaxy S8+

Foldables & Others:
✅ Surface Duo
✅ Surface Pro 7

Each test ensures ad placement, interaction buttons, and auto-close work correctly across different screen dimensions.

4. ## Geo-Location Testing
   We will test how the system handles different locations by setting:
   As example Kyiv, Ukraine, the updated Geo-Location Data should be like:

   # Latitude: 50.4501 Longitude: 30.5234 Zip Code: 01001 (Central Kyiv)

Latitude: 50.4501
Longitude: 30.5234
Zip Code: 01001

Expected Behavior:
✅ No errors or failures should occur when changing location settings.
✅ Correct behavior across multiple devices & screen sizes
✅ When click close Ad landing page appears
✅ Ad auto-close after 15 seconds and landing page appears
✅ On Order click open URL in new tab
✅ On background click open other URL in new tab
✅ Geo-location settings (Kyiv, Ukraine) are applied


