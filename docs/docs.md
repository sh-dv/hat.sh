# [Introduction](#introduction)
---

 Hat.sh is a free opensource web app that provides secure file encryption in the browser. 


<br>

# [Features](#features)
---

### Security


- [XChaCha20-Poly1305] - for symmetric encryption.
- [Argon2id] - for password-based key derivation.


The libsodium library is used for all cryptographic algorithms. technical details here.

<br>

### Privacy

- The app runs locally in your browser.
- No data is ever collected or sent to anyone.​



[//]: # (links)

   [XChaCha20-Poly1305]: <https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction>
   [Argon2id]: <https://github.com/p-h-c/phc-winner-argon2>



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

>You should always use a strong password!



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
The majority of individuals struggle to create and remember passwords, resulting in weak passwords and password reuse. Password-based encryption is substantially less safe as a result of these improper practices. That's why it is recommended to use a password manager like [Bitwarden](https://bitwarden.com/), where you are able to generate and store a safe password.  

<br>

If you want to choose a password that you are able to memorize then you should type a passphrase made of 8 words or more.

### Sharing Encrypted Files

If you plan on sending the file you have encrypted, you can do that in any safe file sharing app.

### Sharing Decryption Passwords
Sharing decryption password can be done using a safe end-to-end encrypted messaging app. It's recommended to use a *Disappearing Messages* feature, and to delete the password after the recepient has decrypted the file. 

>Never choose the same password for different files.


<br>

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

Please report bugs via GitHub by opening an issue.

<hr style="height: 1px">

### Why should I use hat.sh?

1. The app uses fast modern secure cryptographic algorithms.
2. It's super fast and easy to use.
3. It runs in the browser, no need to setup or install anything.
4. It's free opensource software and can be self hosted.

<hr style="height: 1px">


### When should I not use hat.sh?

1. If you want to encrypt a disk (e.g [VeraCrypt](https://veracrypt.fr)).
2. If you want to Frequently access encrypted files (e.g [Cryptomator](https://cryptomator.org/)).
3. If you want to encrypt multiple files and directories at once (e.g [Kryptor](https://github.com/samuel-lucas6/Kryptor)).
4. If you want to encrypt files for another person that only they can decrypt (e.g [Kryptor](https://github.com/samuel-lucas6/Kryptor)).
5. If you want something that adheres to industry standards, use [GPG](https://gnupg.org/).

