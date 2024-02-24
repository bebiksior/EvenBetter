# EvenBetter v1.5
EvenBetter is a simple "plugin" that enhances your Caido experience with a few tweaks ;)

## Installation
1. Visit **Settings** and navigate to the **Developer** section
2. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/final/bundle.js and paste it into the `Custom JS`
3. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/final/style.css and paste it into the `Custom CSS`
4. Done! 🎉

## Changelog
- **v1.5**: You can now highlight any row on HTTP History page! Simply right-click on any request and select `Highlight row` :D
- **v1.5**: Fixed some EvenBetter-specific bugs and improved overall stability.
- **v1.5**: Fixed the Import button on the Workflows page. Exporting is temporarily disabled due to limitations in the new Caido release, their team is working on a fix.
- **v1.5**: Removed the Colorize HTTP feature, as the latest Caido release made this possible with passive workflows.
- v1.41: Fixed issue with Colorize HTTP in latest caido release.
- v1.4: Added a popup if you are using outdated EvenBetter version.
- v1.4: EvenBetter settings UI has been reworked once again.
- v1.4: Exporting/Importing Workflows: You can now share your workflows with your team!
- v1.3: Exporting/Importing Scope Presets: You can now share your scope presets with your team by exporting and importing them. Note that while this feature is in BETA, it should work well, though there might be some UI issues.
- v1.3: Migrated to webpack. Previously, it was a single JS file with almost 1000 lines. Now, it's separated into multiple files and then bundled into one file.
- v1.3: EvenBetter settings UI has been reworked.
- v1.2: Fixed some bugs
- v1.2: Added a new tab in Settings for EvenBetter plugin customization. Choose your Caido theme and enable/disable EvenBetter features.
- v1.12: http://ssrf.cvssadvisor.com/ integration! Type `$ssrfinstance` in Replay tab within the request body and it will automatically be replaced with the URL of your new SSRF instance! Also, a window with requests history to this instance will open up.
- v1.11: Sidebar state is now saved in the localStorage!
- v1.1: Implemented colors for HTTP History rows! If your HTTP request includes the parameter `_color=red`, its background will now be set to red. (it also supports other colors :D)
- v1.1: Resolved the Caido UI issue preventing scrolling in the Filters tab.

## Known issues
- Creating quick SSRF instance doesn't open new window with the requests history on MacOS

## Even Darker Theme

### Before
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/efd7a8b7-797b-4093-b794-acb162a72a64)
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/e98cc376-8e48-4e7a-8886-32ead2329386)

### After
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/405d095e-338b-4796-b722-555d8eb73e92)
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/1af01fdb-e789-49b3-b35a-96ea7d5c7585)

## PwnFox compatibility
With Caido version `0.32.0`, passive workflows were introduced, allowing us to integrate PwnFox support within Caido. Dynamic coloring has not been implemented yet which makes it harder to create workflow for PwnFox. With EvenBetter you can download the [PwnFox Support Workflow](https://github.com/bebiksior/EvenBetter/workflow/workflow-PwnFox_Support.json) and simply import it on the Workflow page!

## Share scope with your team
You can now share your scope presets with your team by exporting and importing them.

## Share workflows with your team.
You can now share your workflows with your team by exporting and importing them.


![workflow_share](https://github.com/bebiksior/EvenBetter/assets/71410238/d4a7aa92-8f1f-43b0-a0c6-aede0670adae)

## ssrf.cvssadvisor.com integration
Type `$ssrfinstance` in the Replay tab within the request body and it will automatically be replaced with the URL of your new SSRF instance! Also, a window with requests history to this instance will open up (this doesn't work properly on MacOS yet).


## EvenBetter settings tab
Choose your Caido theme and enable/disable EvenBetter features.

![image](https://github.com/bebiksior/EvenBetter/assets/71410238/231d15aa-a50d-4507-b30f-c060fbb24adc)

## Sidebar Group Rearranging & Hide functionality 

### Sidebar Before & After
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/a1859822-53be-4975-acb3-189132609188)
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/bd48fad3-4b29-4a86-99d1-bb11655141cc)

## Contribution
Feel free to contribute! Open to pull requests that make the Caido even better :D
