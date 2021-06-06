
<p align="center">
  <a href="#" rel="noopener">
 <img src="https://i.imgur.com/F8nNzHi.png"></a>
</p>

<a href="https://v2-beta.hat.sh" style="color:#000"><h3 align="center">v2-beta.hat.sh</h3></a>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)](#)
  [![Build](https://travis-ci.org/sh-dv/hat.sh.svg?branch=master)](https://travis-ci.org/sh-dv/hat.sh)
  [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#)


</div>

---


this beta version demonstrates memory efficient large file chunked encryption using streams with libsodium.js 
(with xchacha20poly1305 and argon2id)



## What's new

- switching to xchacha20poly1305 for symmetric stream encryption and Argon2id for password-based key derivation. instead of AES-256-GCM and PBKDF2.
- using the libsodium library for all cryptography instead of the WebCryptoApi.
- in this version, the app doesn't read the whole file in memory. instead, it's sliced into 64MB chunks that are processed one by one.
- since we are not using any server-side processing, the app registers a fake download URL (/file) that is going to be handled by the service-worker fetch api.
- if all validations are passed, a new stream is initialized. then, file chunks are transferred from the main app to the 
service-worker file via messages.
- each chunk is encrypted/decrypted on it's on and added to the stream.
- after each chunk is written on disk it is going to be immediately garbage collected by the browser, this leads to never having more than a few chunks in the memory at the same time.




## Installation

Download or clone the repository

    git clone --branch v2-beta https://github.com/sh-dv/hat.sh.git hat.sh-v2-beta

go to the app directory

    cd hat.sh-v2-beta or [app directory]

open terminal and install the node modules that are in the package.json file

    npm install

build the app

    npm run build
    
then start the app by running:

    npm run serve

should be running on http://localhost:1989



## Browser Compatibility
- check out [service-worker fetch event compatibility.](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent)
- for now safari and mobile browsers are not supported, but we will be adding support to them but with some file size limitations (max 2gb)



## Credits

[libsodium.js](https://github.com/jedisct1/libsodium.js)

[bootstrap](https://github.com/twbs/bootstrap) for the responsive css layout

[font-awesome](https://github.com/FortAwesome/Font-Awesome) for the icons

## License
[Copyright (c) 2021 sh-dv](https://github.com/sh-dv/hat.sh/blob/v2-beta/LICENSE)

