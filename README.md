
<p align="center">
  <a href="#" rel="noopener">
 <img src="https://i.imgur.com/F8nNzHi.png"></a>
</p>

<a href="https://hat.sh" style="color:#000"><h3 align="center">hat.sh</h3></a>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)](#)
  [![Node.js CI](https://github.com/sh-dv/hat.sh/actions/workflows/node.js.yml/badge.svg?branch=v2-beta)](https://github.com/sh-dv/hat.sh/actions/workflows/node.js.yml)
  [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#)


</div>

---

[Hat.sh](https://hat.sh) is a web app that provides secure file encryption in the browser. It's **fast**, **secure** and runs **locally**, the app never uploads the files to the server. An easy to use app that uses modern secure cryptographic algorithms with chunked AEAD stream encryption/decryption.

V2 of hat.sh introduced memory efficient in-browser large file chunked encryption using streams with libsodium.js

For old V1 branch [here](https://github.com/sh-dv/hat.sh/tree/v1.5).
## Usage

![how-to-use-gif](https://i.imgur.com/EL45e9g.gif)

<br>

## Features


### Security

- XChaCha20-Poly1305 - for symmetric encryption.
- Argon2id - for password-based key derivation.

The libsodium library is used for all cryptographic algorithms.


### Privacy

- The app runs locally in your browser.
- No data is ever collected or sent to anyone.​

<br>

## Offline Use

The app can be easily self hosted, please follow the [installation](https://hat.sh/about/#installation) instructions.

<br>

## What's new in v2

- switching to xchacha20poly1305 for symmetric stream encryption and Argon2id for password-based key derivation. instead of AES-256-GCM and PBKDF2.
- using the libsodium library for all cryptography instead of the WebCryptoApi.
- in this version, the app doesn't read the whole file in memory. instead, it's sliced into 64MB chunks that are processed one by one.
- since we are not using any server-side processing, the app registers a fake download URL (/file) that is going to be handled by the service-worker fetch api.
- if all validations are passed, a new stream is initialized. then, file chunks are transferred from the main app to the 
service-worker file via messages.
- each chunk is encrypted/decrypted on it's on and added to the stream.
- after each chunk is written on disk it is going to be immediately garbage collected by the browser, this leads to never having more than a few chunks in the memory at the same time.

<br>

## Browser Compatibility
We officially support the last two versions of every major browser. Specifically, we test on the following 
-   **Chrome**  on Windows, macOS, and Linux , Android
-   **Firefox**  on Windows, macOS, and Linux
-   **Safari**  on iOS and macOS
-   **Edge**  on Windows

Safari and Mobile browsers are limited to 1GB files, due to lack of support with server-worker fetch api.

<br>

## Credits

[libsodium.js](https://github.com/jedisct1/libsodium.js)

[next.js](https://nextjs.org/)

[material-ui](https://material-ui.com/)

## License
[Copyright (c) 2021 sh-dv](https://github.com/sh-dv/hat.sh/blob/master/LICENSE)

