# [CHANGELOG](#changelog)

---
## v2.3.6

- Update packages
- Czech translation (by [Franatrtur](https://github.com/Franatrtur)).
- Turkish translation (by [darkao](https://github.com/darkao)).
- Japanese translation (by [Frank7sun](https://github.com/Frank7sun)).

## v2.3.5

- Update packages
- Slovak translation (by [t0mzSK](https://github.com/t0mzSK)).
- Spanish translation (by [Xurdejl](https://github.com/Xurdejl)).

## v2.3.4

- Update packages
- Russian translation (by [Ser-Bul](https://github.com/Ser-Bul)).
- Italian translation (by [matteotardito](https://github.com/matteotardito)).

## v2.3.3

- Added page loading indicator.
- Multiple UI elements redesign.
- German translation (by [stophecom](https://github.com/stophecom)).
- Fix file name encoding bug.
- Update packages.
- Code review, cleanup and bug fixes.

## v2.3.2

- Critical bug fix that lead to file decryption errors, and file encryption in certain cases. [Release info.](https://github.com/sh-dv/hat.sh/releases/tag/v2.3.2)

## v2.3.1

- Update packages
- Code review, cleanup and bug fixes.

## v2.3.0

- Improve password strength checking.
- Add password crack time estimation.
- Automated translation according to browser locale.
- Chinese translation (by [qaqland](https://github.com/qaqland)).
- UI/UX tweaks.
- Optimize docker containers.
- Code review, cleanup and bug fixes.

## v2.2.2

- Sending the file name to SW instead of appending them to the URL.
- French translation (by [bbouille](https://github.com/bbouille)).
- Officially accepting Monero (xmr) for donations.
- show English documentations as default if current locale documentations are not available.
- Code review, cleanup and bug fixes.

## v2.2.1

- Create special page for key pair generation (accessible at /generate-keys)
- Alert users when duplicate tabs are opened.
- Disable back button while testing password/keys.
- Minor bug fixes.

## v2.2.0

- Multiple files encryption/decryption.
- Adding Dark Mode and tweaking styles.
- Implementing custom localization.
- In an effort to encourage the use of secure passwords, The minimum number of characters in the password input has been set to 12 characters.
- Adding the ability to generate a QR code for the public key when generating a keypair.
- New file picker design, display of total files counts and size. 
- Visiting different tabs through custom links (e.g ?tab=decryption).
- Code review, cleanup and bug fixes.

## v2.1.0

- Fixed navigation bug that lead sometimes to duplicate functions which caused increased encrypted file size. (CRITICAL)
- Documentation enhancement.
- Bug fixes and code review.

## v2.0.9

- End to End testing with Cypress.
- OS-level virtualization with Docker.
- Show notification when copy to clipbaord.
- Documentation enhancement.
- Bug fixes and code review.

## v2.0.8

- Adding asymmetric key cryptography.
- Adding a key pair generator.
- Create shareable links that contain sender's public key.
- Possibility to choose encryption methods.
- Hide encryption passwords by default
- Removal of idle timer.
- File validation checks are now performed before passwords entry.
- Documentation enhancement.
- Bug fixes and code review.

## v2.0.7

- stable release of v2.
- code review and minor bug fixes.

## V2.0.6

- Fix file name bug in decryption download.
- Implementing the password strength checker using zxcvbn.
- Adding a password generate button inside the password field in the encryption panel.
- Adding a password visibility button (on/off) inside the password field in the decryption panel.
- About page redesign (documentation).
- Idle timer fixes.
- Detect if the file was decrypted using an old version of hat.sh (v1).
- Safely encode file names passed to SW.
- Update node.js to the newest version.
- Adding the changelog file to github.

## V2.0.5

- Fix critical bug with useEffect that leads to increased file output size.
- Programming the markdown file parser for the hat.sh documentation.
- Creating the About page.
- Implementing an idle timer where user gets notified when they are inactive with app, where they are asked to reload the page.
- Panel redesign.
- Redesigning the Browse Button.
- Adding an emoji on the homepage.
- Removal of extra code comments.

## V2.0.4
- Code review.
- Removal of unwanted lines of code.
- Comments cleanup.

## V2.0.3

- Bug fixes.
- Changing the whole UI design.
- Improved File Validation.
- Improved Password Validation.
- Implementing a Stepper like design where the user has to go through steps to finish the encryption/decryption.
- Safari and Mobile users are now limited to 1GB file.

## V2.0.2
- A lot of bug fixes and code cleaning.
- Adding support to Safari and Mobile browsers.

## V2.0.1
- bug fixes.
- Switching to React (next) instead of vanilla javascript.

## V2.0.0

- The birth of hat.sh v2 beta where it introduced in-browser memory efficient large file chunked encryption using streams with libsodium.js and switching algorithms to xchacha20poly1305 and argon2id.