  
<p align="center">
  <a href="#" rel="noopener">
 <img src="https://i.imgur.com/F8nNzHi.png"></a>
</p>

<h3 align="center">Hat.sh</h3>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)](#)
  [![https://github.com/sh-dv/hat.sh](https://travis-ci.org/sh-dv/hat.sh.svg?branch=master)](#)
  [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#)
  <p align="center">
    <a href="https://www.producthunt.com/posts/hat-sh?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-hat-sh" target="_blank">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=157956&theme=dark&period=daily" alt="hat.sh - Free, fast, secure and serverless file encryption | Product Hunt Embed" width="250px"/>
    </a>
  </p>

</div>

---


[hat.sh](https://hat.sh) is a  javascript app that provides secure file encryption using the [AES-256-GCM](https://www.w3.org/TR/WebCryptoAPI/#aes-gcm) algorithm from [WebCryptoAPI](https://www.w3.org/TR/WebCryptoAPI/#aes-gcm) provided by your browser. it was coded following the WebCrypto [Documentations](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) .

 It's **fast**, **secure** and **Serverless**, the app never uploads the files to the server.
 
in a small amount of code the app can encrypt any **type** of files at any **size** within seconds.
 
To use the app all you have to do is **Browse** a file,  **Type** a Decryption Key or **Generate** one through our secure key generator. and your encrypted file is ready to download.

## Downloads

 [**macOS**](https://github.com/sh-dv/hat.sh/releases/download/release-builds/hat.sh-mac.zip) , [**Windows**](https://github.com/sh-dv/hat.sh/releases/download/release-builds/hat.sh-win.zip) and [**linux**](https://github.com/sh-dv/hat.sh/releases/download/release-builds/hat.sh-linux.zip)


## Installation using electron

Download or clone the repository

 

    $ git clone https://github.com/sh-dv/hat.sh.git hat.sh

go to the app electron directory

    cd [app directory]/elctron

open terminal and install the node modules that are in the package.json file

    sudo npm install
after the packages are installed just run the app

    npm start
to package the app for multiple os systems (mac,win,linux) :

    npm run package-[os name] 



## How to use
just simply browse a file, type a decryption key or use our secure key generator, and encrypt or decrypt.

![enter image description here](https://i.imgur.com/btZRe3c.gif)




## Credits
[zxcvbn.js](https://github.com/dropbox/zxcvbn) for Smart Password Strength Estimation

[bootstrap](https://github.com/twbs/bootstrap) for the responsive css layout

[font-awesome](https://github.com/FortAwesome/Font-Awesome) for the icons

## License
[Copyright (c) 2019 sh-dv](https://github.com/sh-dv/hat.sh/blob/master/LICENSE)
