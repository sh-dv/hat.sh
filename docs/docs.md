# [Introduction](#introduction)

---

Hat.sh is a free [opensource] web app that provides secure file encryption in the browser.

<br>

# [Features](#features)

---

### Security

- [XChaCha20-Poly1305] - for symmetric encryption.
- [Argon2id] - for password-based key derivation.

The libsodium library is used for all cryptographic algorithms. [Technical details here](#technical-details).

<br>

### Privacy

- The app runs locally in your browser.
- No data is ever collected or sent to anyone.​

<br>

# [Installation](#installation)

---

Download or clone the repository

```bash
git clone --branch v2-beta https://github.com/sh-dv/hat.sh.git hat.sh-v2-beta
```

<br>

Go to the app directory

```bash
cd hat.sh-v2-beta or [app directory]
```

<br>

Open terminal and install the packages

```bash
npm install
```

<br>

Run the app in dev mode

```bash
npm run dev
```

<br>

The app should be running on https://localhost:3000

<br>

If you wish to build and export the app. run :

```bash
npm run build
```

<br>

# [Usage](#usage)

---

### File Encryption

1. Open hat.sh
2. Navigate to the Encryption panel
3. Drag & Drop or Select the file that you wish to encrypt
4. Enter the encryption password
5. Download the encrypted file

> You should always use a strong password!

### File Decryption

1. Open hat.sh
2. Navigate to the Decryption panel
3. Drag & Drop or Select the file that you wish to decrypt
4. Enter the decryption password
5. Download the decrypted file

<br>

# [Limitations](#limitations)

---

### Folder & Multiple Files Encryption

This feature is not available for security reasons. If you wish to encrypt a whole directory or multiple files then you should make a Zip and encrypt it.

### File Metadata

Files encrypted with the app are identifiable by looking at the file signature that is used by the app to verify the content of a file, Such signatures are also known as magic numbers or Magic Bytes. These Bytes are authenticated and cannot be changed.

### Safari and Mobile Browsers

Safari and Mobile browsers are limited to a file size of 1GB due to some issues related to service-workers. In addition, this limitation also applies when the app fails to register the service-worker (e.g FireFox Private Browsing).

<br>

# [Best Practices](#best-practices)

---

### Choosing Passwords

The majority of individuals struggle to create and remember passwords, resulting in weak passwords and password reuse. Password-based encryption is substantially less safe as a result of these improper practices. That's why it is recommended to use the built in password generator and use a password manager like [Bitwarden], where you are able to store the safe password.

<br>

If you want to choose a password that you are able to memorize then you should type a passphrase made of 8 words or more.

### Sharing Encrypted Files

If you plan on sending the file you have encrypted, you can do that in any safe file sharing app.

### Sharing Decryption Passwords

Sharing decryption password can be done using a safe end-to-end encrypted messaging app. It's recommended to use a _Disappearing Messages_ feature, and to delete the password after the recepient has decrypted the file.

> Never choose the same password for different files.

<br>

# [Technical Details](#technical-details)

---

## File encryption

<br>

### - Password hashing and Key Derivation



<br>

### XChaCha20-Poly1305

The XChaCha20-Poly1305 construction can safely encrypt a practically unlimited number of messages with the same key, without any practical limit to the size of a message. As an alternative to counters, its large nonce size (192-bit) allows random nonces to be safely used.
<br>
XChaCha20-Poly1305 applies the construction described in Daniel Bernstein's [Extending the Salsa20 nonce paper] to the ChaCha20 cipher in order to extend the nonce size to 192-bit.
<br>
This extended nonce size allows random nonces to be safely used, and also facilitates the construction of misuse-resistant schemes.
<br>
The XChaCha20-Poly1305 implementation in libsodium is portable across all supported architectures and It will [soon] become an IETF standard.

- Encryption: XChaCha20 stream cipher
- Authentication: Poly1305 MAC

<br>

### V2 vs V1

- switching to xchacha20poly1305 for symmetric stream encryption and Argon2id for password-based key derivation. instead of AES-256-GCM and PBKDF2.
- using the libsodium library for all cryptography instead of the WebCryptoApi.
- in this version, the app doesn't read the whole file in memory. instead, it's sliced into 64MB chunks that are processed one by one.
- since we are not using any server-side processing, the app registers a fake download URL (/file) that is going to be handled by the service-worker fetch api.
- if all validations are passed, a new stream is initialized. then, file chunks are transferred from the main app to the
  service-worker file via messages.
- each chunk is encrypted/decrypted on it's own and added to the stream.
- after each chunk is written on disk it is going to be immediately garbage collected by the browser, this leads to never having more than a few chunks in the memory at the same time.

# [FAQ](#faq)

---

### Does the app log or store any of my data?

No, hat.sh never stores any of your data. It only runs locally in your browser.

<hr style="height: 1px">

### Is hat.sh free?

Yes, Hat.sh is free and always will be. However, please consider donating to support the project.

<hr style="height: 1px">

### Which file types are supported? Is there a file size limit?

Hat.sh accepts all file types. There's no file size limit, meaning files of any size can be encrypted.

Safari browser and mobile/smartphones browsers are limited to 1GB.

<hr style="height: 1px">

### I forgot my password, can I still decrypt my files?

No, we don't know your password. Always make sure to store your passwords in a password manager.

<hr style="height: 1px">

### Does the app connect to the internet?

Once you visit the site and the page loads, it runs only offline.

<hr style="height: 1px">

### How can I contribute?

Hat.sh is an open-source application. You can help make it better by making commits on GitHub. The project is maintained in my free time. Donations of any size are appreciated.

<hr style="height: 1px">

### How do I report bugs?

Please report bugs via [Github] by opening an issue labeled with "bug".

<hr style="height: 1px">

### How do I report a security vulnerability?

If you identify a valid security issue, please write an email to hatsh-security@pm.me

There is no bounty available at the moment, but your github account will be credited in the acknowledgements section in the app documentation.

<hr style="height: 1px">

### Why should I use hat.sh?

1. The app uses fast modern secure cryptographic algorithms.
2. It's super fast and easy to use.
3. It runs in the browser, no need to setup or install anything.
4. It's free opensource software and can be self hosted.

<hr style="height: 1px">

### When should I not use hat.sh?

1. If you want to encrypt a disk (e.g [VeraCrypt]).
2. If you want to Frequently access encrypted files (e.g [Cryptomator]).
3. If you want to encrypt multiple files and directories at once (e.g [Kryptor]).
4. If you want to encrypt files for another person that only they can decrypt (e.g [Kryptor]).
5. If you want something that adheres to industry standards, use [GPG].

<br>

[//]: # "links"
[xchacha20-poly1305]: https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction
[argon2id]: https://github.com/p-h-c/phc-winner-argon2
[opensource]: https://github.com/sh-dv/hat.sh
[bitwarden]: https://bitwarden.com/
[Extending the Salsa20 nonce paper]: https://cr.yp.to/snuffle/xsalsa-20081128.pdf
[soon]: https://tools.ietf.org/html/draft-irtf-cfrg-xchacha
[github]: https://github.com/sh-dv/hat.sh
[VeraCrypt]: https://veracrypt.fr
[Cryptomator]: https://cryptomator.org
[Kryptor]: https://github.com/samuel-lucas6/Kryptor
[GPG]: https://gnupg.org