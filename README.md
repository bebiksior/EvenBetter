# EvenBetter v2.0
EvenBetter is a simple "plugin" that enhances your Caido experience with a few tweaks ;)

## Installation
1. Visit **Settings** and navigate to the **Developer** section
2. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/final/bundle.js and paste it into the `Custom JS`
3. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/final/style.css and paste it into the `Custom CSS`
4. Done! 🎉

## Changelog v2.0
- **v2.0**: EvenBetter code has been rewritten in TypeScript, which makes it more maintainable and easier to contribute to :D
- **v2.0**: Quick Decode: new feature that allows you to quickly decode text just by selecting or hovering over it on the Replay page
- **v2.0**: Send to Match & Replace: new context menu button on the HTTP History page that allows you to quickly send selected text into the Match & Replace page
- **v2.0**: Added two new themes: Neon and Deep Dark
- **v2.0**: ESC keybind now closes context menu.
- **v2.0**: EvenBetter will warn you if you are using old CSS version.

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
