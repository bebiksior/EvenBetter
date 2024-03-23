# EvenBetter v2.1
EvenBetter is a simple "plugin" that enhances your Caido experience with a few tweaks ;)

## Installation
1. Visit **Settings** and navigate to the **Developer** section
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

## Share scope with your team
You can now share your scope presets with your team by exporting and importing them.

## EvenBetter settings tab
Choose your Caido theme and enable/disable EvenBetter features.

![image](https://github.com/bebiksior/EvenBetter/assets/71410238/231d15aa-a50d-4507-b30f-c060fbb24adc)

## Sidebar Group Rearranging & Hide functionality 

### Sidebar Before & After
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/a1859822-53be-4975-acb3-189132609188)
![image](https://github.com/bebiksior/EvenBetter/assets/71410238/bd48fad3-4b29-4a86-99d1-bb11655141cc)

## Contribution
Feel free to contribute! Open to pull requests that make the Caido even better :D
