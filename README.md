# Welcome to the Hat project !

this is a  javascript app that provides secure file encryption using the [AES-GCM](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) algorithm.

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
        length: 256, //can be  128, 192, or 256
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
)
.then(function(key){
    //returns a key object
    console.log(key);
})
.catch(function(err){
    console.error(err);
});
```
#### AES-GCM - importKey
```javascript
window.crypto.subtle.importKey(
    "jwk", //can be "jwk" or "raw"
    {   //this is an example jwk key, "raw" would be an ArrayBuffer
        kty: "oct",
        k: "Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE",
        alg: "A256GCM",
        ext: true,
    },
    {   //this is the algorithm options
        name: "AES-GCM",
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
)
.then(function(key){
    //returns the symmetric key
    console.log(key);
})
.catch(function(err){
    console.error(err);
});
```
#### AES-GCM - exportKey
```javascript
window.crypto.subtle.exportKey(
    "jwk", //can be "jwk" or "raw"
    key //extractable must be true
)
.then(function(keydata){
    //returns the exported key data
    console.log(keydata);
})
.catch(function(err){
    console.error(err);
});
```
#### AES-GCM - encrypt
```javascript
window.crypto.subtle.encrypt(
    {
        name: "AES-GCM",

        //Don't re-use initialization vectors!
        //Always generate a new iv every time your encrypt!
        //Recommended to use 12 bytes length
        iv: window.crypto.getRandomValues(new Uint8Array(12)),

        //Additional authentication data (optional)
        additionalData: ArrayBuffer,

        //Tag length (optional)
        tagLength: 128, //can be 32, 64, 96, 104, 112, 120 or 128 (default)
    },
    key, //from generateKey or importKey above
    data //ArrayBuffer of data you want to encrypt
)
.then(function(encrypted){
    //returns an ArrayBuffer containing the encrypted data
    console.log(new Uint8Array(encrypted));
})
.catch(function(err){
    console.error(err);
});
```
#### AES-GCM - decrypt
```javascript
window.crypto.subtle.decrypt(
    {
        name: "AES-GCM",
        iv: ArrayBuffer(12), //The initialization vector you used to encrypt
        additionalData: ArrayBuffer, //The addtionalData you used to encrypt (if any)
        tagLength: 128, //The tagLength you used to encrypt (if any)
    },
    key, //from generateKey or importKey above
    data //ArrayBuffer of the data
)
.then(function(decrypted){
    //returns an ArrayBuffer containing the decrypted data
    console.log(new Uint8Array(decrypted));
})
.catch(function(err){
    console.error(err);
});
```

## License
[Copyright (c) 2019 shdv](https://github.com/sh-dv/hat.sh/blob/master/LICENSE.md)
