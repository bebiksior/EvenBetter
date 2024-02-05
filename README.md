# EvenBetter v1.3
Even Better is a simple "plugin" that enhances your Caido experience with a few tweaks ;)

## Installation
1. Visit **Settings** and navigate to the **Developer** section
2. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/dist/bundle.js and paste it into the "Custom JS"
3. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/style.css and paste it into the "Custom CSS"
4. Done! 🎉

## Changelog
- v1.3: [BETA] Exporting/Importing Scope Presets: You can now share your scope presets with your team by exporting and importing them. Note that while this feature is in BETA, it should work well, though there might be some UI issues.
- v1.3: Migrated to webpack. Previously, it was a single JS file with almost 1000 lines. Now, it's separated into multiple files and then bundled into one file.
- v1.3: EvenBetter settings UI has been reworked.
- v1.2: Fixed some bugs
- v1.2: Added a new tab in Settings for EvenBetter plugin customization. Choose your Caido theme and enable/disable EvenBetter features.
- v1.12: http://ssrf.cvssadvisor.com/ integration! Type `$ssrfinstance` in Replay tab within the request body and it will automatically be replaced with the URL of your new SSRF instance! Also, a window with requests history to this instance will open up.
- v1.11: Sidebar state is now saved in the localStorage!
- v1.1: Implemented colors for HTTP History rows! If your HTTP request includes the parameter `_color=red`, its background will now be set to red. (it also supports other colors :D)
- v1.1: Resolved the Caido UI issue preventing scrolling in the Filters tab.

## Dark Theme

### Before
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/efd7a8b7-797b-4093-b794-acb162a72a64)
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/e98cc376-8e48-4e7a-8886-32ead2329386)

### After
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/405d095e-338b-4796-b722-555d8eb73e92)
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/1af01fdb-e789-49b3-b35a-96ea7d5c7585)

## HTTP History rows colorized
If your HTTP request includes the parameter `_color=red`, its background will now be set to red. (it also supports other colors :D)

![image](https://github.com/bebiksior/EvenBetter/assets/71410238/c5b0f5dc-ba08-4e68-aeff-c288ef8ddad7)

## Share scope with your team
You can now share your scope presets with your team by exporting and importing them. Note that while this feature is in BETA, it should work well, though there might be some UI issues.


## ssrf.cvssadvisor.com integration
Type `$ssrfinstance` in the Replay tab within the request body and it will automatically be replaced with the URL of your new SSRF instance! Also, a window with requests history to this instance will open up.

## PwnFox compatibility
EvenBetter is compatible with this modified version of PwnFox https://github.com/bebiksior/PwnFox-CaidoCompatible

## EvenBetter settings tab
Choose your Caido theme and enable/disable EvenBetter features.
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/6cdecfcf-7b62-4b1b-a011-45f462e79f8b)

## Sidebar Group Rearranging & Hide functionality 

### Sidebar Before & After
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/a1859822-53be-4975-acb3-189132609188)
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/bd48fad3-4b29-4a86-99d1-bb11655141cc)

## Contribution
Feel free to contribute! Open to pull requests that make the Caido UI even better :D