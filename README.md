# Welcome to the Hat project !

this is a  javascript app that provides secure file encryption using the [AES-GCM](https://www.w3.org/TR/WebCryptoAPI/#aes-gcm) algorithm .

 It's **fast**, **secure** and **Serverless**, the app never uploads the files to the server.
 
 the app can encrypt any **type** of files at any **size** within seconds.
 
 it uses the  [zxcvbn.js](https://github.com/dropbox/zxcvbn) library for **Smart** Password **Strength** Estimation
 
 You can **Type** a Decryption Key or **Generate** one through our secure key generator

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sh-dv/hat.sh)

## How to use
just simply browse a file , type a decryption key or use our secure key generator , and encrypt or decrypt.

![enter image description here](https://i.imgur.com/ziBhQhP.gif)

## Offline Use

the app is cross-platform and is available to download on **macOS** and **Windows**

## Requirements
[NodeJS and NPM](https://www.npmjs.com/get-npm)

[Browserify](http://browserify.org/#install) which lets you require('modules') in the browser by bundling up all of your dependencies. or you can serve the app in NodeJS `$ node app.js`

## Installation

non-dependencies version of the app is available in the **Build** folder , Just run the **index.html**

or =>

Download or clone the repository

 

    $ git clone https://github.com/sh-dv/hat.sh.git hat.sh

go to the app directory

    cd [app directory]

open terminal and install the node modules that are in the package.json file

    sudo npm install
after the packages are installed 
bundle main app.js and modules together in one file using Browserify

    browserify src/js/app.js -o bundle.js
then start the app by running index.html

## Browser Compatibility
We officially support the last two versions of every major browser. Specifically, we test on the following 
-   **Chrome**  on Windows, macOS, and Linux , IOS, Android
-   **Firefox**  on Windows, macOS, and Linux
-   **Safari**  on iOS and macOS
-   **Edge**  on Windows
-   **IE 11**  on Windows

for more info see [WebCryptoAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) home page
![enter image description here](https://i.imgur.com/hJveblf.png)


## Crypto Examples

#### AES-GCM - generateKey
```javascript
  window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  )
.then(function(key){
    console.log(key);
})
.catch(function(err){
    console.error(err);
});
```
#### AES-GCM - importKey
```javascript
function importSecretKey(rawKey) {
    return window.crypto.subtle.importKey(
      "raw",
      rawKey,
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );
  }
.then(function(key){
    console.log(key);
})
.catch(function(err){
    console.error(err);
});
```
#### AES-GCM - exportKey
```javascript
async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
      "raw",
      key
    )
.then(function(keydata){
    console.log(keydata);
})
.catch(function(err){
    console.error(err);
});
```
#### AES-GCM - encrypt
```javascript
async function encryptMessage(key) {
    let encoded = getMessageEncoding();
    // The iv must never be reused with a given key.
    iv = window.crypto.getRandomValues(new Uint8Array(12));
    ciphertext = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encoded
        )
        .then(function (encrypted) {
            console.log(new Uint8Array(encrypted));
        })
        .catch(function (err) {
            console.error(err);
        });
}
```
#### AES-GCM - decrypt
```javascript
async function decryptMessage(key) {
    let encoded = getMessageEncoding();
    let decrypted = await window.crypto.subtle.decrypt({
            name: "AES-GCM",
            iv: iv
        },
        key,
        ciphertext
       )
       .then(function (decrypted) {
            console.log(new Uint8Array(encrypted));
        })
        .catch(function (err) {
            console.error(err);
        });
}
```

## License
[Copyright (c) 2019 shdv](https://github.com/sh-dv/hat.sh/blob/master/LICENSE.md)
