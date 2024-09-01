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

## Sponsors
Maintenance of EvenBetter is possible thanks to the following sponsors:

<!-- sponsors --><a href="https://github.com/Rhynorater"><img src="https:&#x2F;&#x2F;avatars.githubusercontent.com&#x2F;u&#x2F;2998191?u&#x3D;146356f1a24905faa5470e0b4ba6e1ebe0a3db42&amp;v&#x3D;4" width="60px" alt="Justin Gardner" /></a><a href="https://github.com/projectmonke"><img src="https:&#x2F;&#x2F;avatars.githubusercontent.com&#x2F;u&#x2F;132834912?u&#x3D;682428a21d3200611d5a9b34ba2d7687b52d1412&amp;v&#x3D;4" width="60px" alt="Project Monke" /></a><!-- sponsors -->

## Installation [Recommended]

1. [Follow installation steps for EvenBetterExtensions](https://github.com/bebiksior/EvenBetterExtensions)
2. Navigate to `Plugins` sidebar page and then to the `Library` tab
3. Find `EvenBetter` and click `Install`
4. **Optional**: you can enable auto-updates for EvenBetter by going to the Plugins settings and toggling the `auto-update` feature.
5. Done! 🎉

## Installation [Old, only EvenBetter, without auto-updates]

1. Go to the [EvenBetter Releases tab](https://github.com/bebiksior/EvenBetter/releases) and download the latest `plugin.zip` file
2. In your Caido instance, navigate to the `Plugins` page, click `Install package` and select the downloaded `plugin.zip` file
3. Done! 🎉


## Changelog v2.5.0
- **Quick Decode Rework**: it's now much less buggy and allows you to change the encoding type
- **Workflow Library Improvements**: improved UI, added "Add All" button, and arrow that allows you to expand the workflow info


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
