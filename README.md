# EvenBetter [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20me)](https://twitter.com/bebiksior)
`EvenBetter` is a frontend Caido plugin that makes the [Caido](https://github.com/caido) experience even better 😎

Here's what **EvenBetter** implements:
- **Quick SSRF**: deploy SSRF testing instance with a single click
- **Quick Decode**: quickly decode and edit encoded values within request body on the Replay page
- **Library**: add workflows made by the community into your Caido project with just a single click
- **EvenBetter Settings**: customize and toggle EvenBetter features
- **Custom Themes**: change the colors of the Caido UI
- **Sidebar Tweaks**: rearrange and hide sidebar pages
- **Scope Share**: export/import scope presets
- **Send to Match & Replace**: custom right-click menu button that sends selected text to the Match & Replace page
- ... more small tweaks that improve overall [Caido](https://github.com/caido) experience


## Installation
1. In Caido, go to **Settings** and then navigate to the **Developer** section
2. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/final/evenbetter.js and paste it into the `Custom JS`
3. Copy the entire content from https://github.com/bebiksior/EvenBetter/blob/main/final/style.css and paste it into the `Custom CSS`
4. Done! 🎉


## Changelog v2.1
- **Quick SSRF:** Quickly create new SSRF testing instance and view interactions on the new sidebar page. Now supports `ssrf.cvssadvisor.com` and `interactsh.com`
- **Quick Decode Enhancement:** You can now edit text within Quick Decode on the Replay page and it will automatically update the encoded value.
- **Bug fixes:** Fixed some issues with Caido v0.34.0
  
![quick_ssrf](https://github.com/bebiksior/EvenBetter/assets/71410238/4900ac42-2d48-4914-8b54-482fff15ad97)
![quiick_decode](https://github.com/bebiksior/EvenBetter/assets/71410238/5e2a1e59-7de6-4982-99e4-21745404a619)


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
