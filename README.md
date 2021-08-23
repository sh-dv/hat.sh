
<p align="center">
  <a href="#" rel="noopener">
 <img src="https://i.imgur.com/F8nNzHi.png"></a>
</p>

<a href="https://v2-beta.hat.sh" style="color:#000"><h3 align="center">v2-beta.hat.sh</h3></a>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)](#)
  [![Node.js CI](https://github.com/sh-dv/hat.sh/actions/workflows/node.js.yml/badge.svg?branch=v2-beta)](https://github.com/sh-dv/hat.sh/actions/workflows/node.js.yml)
  [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#)


</div>

---


this beta version demonstrates memory efficient large file chunked encryption using streams with libsodium.js 
(with xchacha20poly1305 and argon2id)



## What's new in v2

- switching to xchacha20poly1305 for symmetric stream encryption and Argon2id for password-based key derivation. instead of AES-256-GCM and PBKDF2.
- using the libsodium library for all cryptography instead of the WebCryptoApi.
- in this version, the app doesn't read the whole file in memory. instead, it's sliced into 64MB chunks that are processed one by one.
- since we are not using any server-side processing, the app registers a fake download URL (/file) that is going to be handled by the service-worker fetch api.
- if all validations are passed, a new stream is initialized. then, file chunks are transferred from the main app to the 
service-worker file via messages.
- each chunk is encrypted/decrypted on it's on and added to the stream.
- after each chunk is written on disk it is going to be immediately garbage collected by the browser, this leads to never having more than a few chunks in the memory at the same time.

## To Do 👨‍💻
- handle stream back pressures

## Installation

Download or clone the repository

    git clone --branch v2-beta https://github.com/sh-dv/hat.sh.git hat.sh-v2-beta

go to the app directory

    cd hat.sh-v2-beta or [app directory]

open terminal and install the node modules that are in the package.json file

    npm install

run the app in dev mode

    npm run dev


should be running on http://localhost:3000



## Browser Compatibility
- check out [service-worker fetch event compatibility.](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent)
- Safari and Mobile Broswers are supported but with a file size limitation (File Size up to 1GB)




## Credits

[libsodium.js](https://github.com/jedisct1/libsodium.js)

[next.js](https://nextjs.org/)

[material-ui](https://material-ui.com/)

## License
[Copyright (c) 2021 sh-dv](https://github.com/sh-dv/hat.sh/blob/v2-beta/LICENSE)

