# EvenBetter [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20me)](https://twitter.com/bebiksior) [![Static Badge](https://img.shields.io/badge/TODO%20List-00000?style=flat&color=%233251ed)](https://github.com/users/bebiksior/projects/2)

`EvenBetter` is a frontend Caido plugin that makes the [Caido](https://github.com/caido) experience even better 😎

Here's what **EvenBetter** implements:

- **Quick SSRF**: deploy SSRF testing instance with a single click in the new Quick SSRF sidebar page
- **Quick Decode**: quickly decode and edit encoded values within the request body on the Replay page
- **Font picker**: feature in the EvenBetter settings that allows you to change the font of the Caido UI.
- **Library**: add workflows made by the community into your Caido project with just a single click
- **EvenBetter Settings**: customize and toggle EvenBetter features
- **Custom Themes**: change the colors of the Caido UI
- **Sidebar Tweaks**: rearrange and hide sidebar pages
- **Scope Share**: export/import scope presets
- **Send to Match & Replace**: custom right-click menu button that sends selected text to the Match & Replace page
- ... more small tweaks that improve overall [Caido](https://github.com/caido) experience

## Installation [Recommended]

1. [Follow installation steps for EvenBetterExtensions](https://github.com/bebiksior/EvenBetterExtensions)
2. Navigate to `Extensions` sidebar page
3. Find `EvenBetter` and click `Install`
4. **Optional**: you can enable auto-updates for EvenBetter by going to the Extensions settings and toggling the `auto-update` feature.
5. Done! 🎉

## Installation [Old, only EvenBetter, without auto-updates]

1. In Caido, go to **Settings** and then navigate to the **Developer** section
2. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/final/index.js and paste it into the `Custom JS`
3. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/final/style.css and paste it into the `Custom CSS`
4. Done! 🎉


## Changelog v2.31
- Fixed compatibility issues with Caido v0.36.0
- Added Fira Code font to the font picker
- Fixed issue: Prevent text formatting in the quick decode box
- Fixed issue: Missing data in headers when using quickssrf preview
- Fixed issue: hotReloading sometimes reloads page before saving the changes

## Changelog v2.3

- [EvenBetter: Extensions](https://github.com/bebiksior/EvenBetterExtensions) is now available! 🎉 Now, EvenBetter should be installed through the new **EvenBetterExtensions** plugin. This will allow us to keep the main **EvenBetter** plugin updated.
- [EvenBetter: API](https://github.com/bebiksior/EvenBetterAPI) is now available! 🎉 This API simplitifes creating new Caido plugins, check it out!
- **Font picker**: New feature in the EvenBetter settings that allows you to change the font of the Caido UI.
- **Custom HTTP response**: New feature on the Quick SSRF page that allows you to customize the HTTP response, only supported with `ssrf.cvssadvisor.com`.
- **Clear All Findings**: New button in the Findings page that clears all findings
- **Suggest HTTPQL Command**: New command in the command pallette that uses AI to suggest the HTTPQL query.
- **Extended Command Pallette**: Added new commands to the command pallette. Such as: `Go to Settings: Developer` or `Go to Settings: Rendering`
- **Unicode support**: Added support for unicode encoding in the Quick Decode feature.
- Code improvements and bug fixes.
- Even more workflows! Added awesome workflows created by @Ry0taK 🎉

## Known issues

- Creating interactsh SSRF instance on remote Caido instance will not work, `crypto.subtle` is not available on non-secure origins

## Even Darker Theme

### Before

![image](https://github.com/bebiksior/EvenBetter/assets/71410238/efd7a8b7-797b-4093-b794-acb162a72a64)

### After

![image](https://github.com/bebiksior/EvenBetter/assets/71410238/405d095e-338b-4796-b722-555d8eb73e92)

## PwnFox compatibility

With Caido version `0.32.0`, passive workflows were introduced, allowing us to integrate PwnFox support within Caido. Dynamic coloring has not been implemented yet which makes it harder to create workflow for PwnFox. With EvenBetter you can download the [PwnFox Support Workflow](https://github.com/bebiksior/EvenBetter/workflow/workflow-PwnFox_Support.json) and simply import it on the Workflow page!

## Contribution

Feel free to contribute! If you'd like to request a feature or report a bug, please [create a GitHub Issue](https://github.com/bebiksior/EvenBetter/issues/new).
