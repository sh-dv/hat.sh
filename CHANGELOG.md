# [CHANGELOG](#changelog)

---
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