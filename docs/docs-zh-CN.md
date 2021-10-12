# [Introduction](#introduction)
介绍
---

Hat.sh is a free [opensource] web app that provides secure file encryption in the browser.
Hat.sh是免费[开源]的网页应用，在浏览器中提供安全的文件加密。

<br>

# [Features](#features)
特点

---

### Security
安全性

- [XChaCha20-Poly1305] - for symmetric encryption.
- [XChaCha20-Poly1305] - 使用此项目用来对称加密。
- [Argon2id] - for password-based key derivation.
- [Argon2id] - 使用此项目用于基于密码的密钥推导。
- [X25519] - for key exchange.
- [X25519] - 使用此项目用于密钥交换。

The libsodium library is used for all cryptographic algorithms. [Technical details here](#technical-details).
在所有的加密算法上使用 libsodium 库。[技术细节在这里]

<br>

### Privacy
隐私性

- The app runs locally in your browser.
- 这个应用在您的浏览器本地运行。
- No data is ever collected or sent to anyone.​
- 没有任何数据被收集或者发送给任何人
<br>

### Functionality
功能性
- Secure encryption/decryption of files with passwords or keys.
- 使用密码或密钥对文件进行安全的加密/解密。
- Secure random password generation.
- 安全的随机密码生成。
- Assymetric key pair generation.
- 非对称密钥对生成。
- Authenticated key exchange.
- 认证密钥交换
- Password strength estimation.
- 密码强度评估。

<br>

# [Installation](#installation)

---
It's easy to self host and deploy hat.sh, you can do that either with npm or docker
自行部署 hat.sh 很容易，您可以使用 npm 或 docker 来做到这一点

If you wish to self host the app please follow these instructions:
如果您希望自行部署这个应用，请按照以下说明:

<br>

## With npm
使用npm

Before installation make sure you are running [nodejs](https://nodejs.org/en/) and have [npm](https://www.npmjs.com/) installed
在安装之前，请确保您可以运行[node.js]并安装了[npm]
<br >

1. clone the github repository
把github上的本仓库克隆到本地

```bash
git clone https://github.com/sh-dv/hat.sh.git hat.sh
```

2. move to the folder
进入文件夹

```bash
cd hat.sh
```

3. install dependencies
安装依赖

```bash
npm install
```

4. build app
构建应用

```bash
npm run build
```

5. start hat.sh
启动

```bash
npm run start
```

the app should be running on port 3391.
本应用应该运行在3391端口

<br>

if you wish to run the app in development enviroment run :
如果您想在开发者模式下运行：

<br>

```bash
npm run dev
```

<br>

## With docker
使用docker

You can install the app with docker in multiple ways. You are free to choose wich method you like.
您可以使用docker多种方式地安装这个应用程序，您可以自由选择您喜欢的方法。

<br>

- #### install from docker hub
从docker hub安装

1. pull image from docker hub
从docker hub拉取镜像

```bash
docker pull shdv/hat.sh:latest
```

2. run container
运行

```bash
docker run -p 3991:3991 shdv/hat.sh
```

<br>

- #### Build an image from source
从源代码构建镜像

1. clone the github repository
把github上的本仓库克隆到本地

```bash
git clone https://github.com/sh-dv/hat.sh.git hat.sh
```

2. move to the folder
进入文件夹

```bash
cd hat.sh
```

3. build image using docker
使用docker构建镜像

```bash
docker build . -t shdv/hat.sh
```

4. run container
运行

```bash
docker run -p 3991:3991 shdv/hat.sh
```

<br>

- #### Using docker compose
使用docker compose

1. clone the github repository
把github上的本仓库克隆到本地

```bash
git clone https://github.com/sh-dv/hat.sh.git hat.sh
```

2. move to the folder
进入文件夹

```bash
cd hat.sh
```

3. build image using docker compose
使用docker compose构建镜像

```bash
docker compose build
```

4. run container
运行

```bash
docker compose up
```

<br>

The app should be running on port 3991.
这个应用会在端口3991上运行

hat.sh is also available as a Docker image. You can find it on [Docker Hub].
hat.sh 也提供 Docker映像，您可以在[Docker Hub]上找到它。

# [Usage](#usage)
使用方法

---

## File Encryption
文件加密

- ### using a password
使用密码

1. Open hat.sh.
1. 打开本应用
1. Navigate to the Encryption panel.
1. 切换到加密栏
1. Drag & Drop or Select the file that you wish to encrypt.
1. 拖拽或者点选您要加密的文件
1. Enter a password or generate one.
1. 输入密码或者生成一个
1. Download the encrypted file.
1. 下载加密后的文件

> You should always use a strong password!
您应该尽量使用强密码

- ### using public and private keys
使用公私密钥

1. Open hat.sh.
1. 打开本应用
1. Navigate to the Encryption panel.
1. 切换到加密栏
1. Drag & Drop or Select the file that you wish to encrypt.
1. 拖拽或者点选您要加密的文件
1. Choose public key method.
1. 选择公钥模式
1. Enter or load recepient's public key and your private key.
输入或载入接收者的公钥和您的私钥
   if you don't have public and private keys you can generate a key pair.
   如果您没有公钥和私钥您可以自己生成一对
1. Download the encrypted file.
1. 下载加密后的文件
1. Share your public key with the recepient so he will be able to decrypt the file.
1. 把您的公钥分享给接收者，这样他就能解密文件
> Never share your private key to anyone! Only public keys should be exchanged.
不要把自己的私钥给任何人！只有公钥可以交换
<br>

## File Decryption
文件解密

- ### using a password
使用密码
1. Open hat.sh.
1. 打开本应用
1. Navigate to the Decryption panel.
1. 切换到解密栏
1. Drag & Drop or Select the file that you wish to decrypt.
1. 拖拽或者点选您要解密的文件
1. Enter the encryption password.
1. 输入加密的密码
1. Download the decrypted file.
1. 下载解密后的文件

- ### using public and private keys
使用公私密钥

1. Open hat.sh.
1. 打开本应用
1. Navigate to the Decryption panel.
1. 切换到解密栏
1. Drag & Drop or Select the file that you wish to decrypt.
1. 拖拽或者点选您要解密的文件
1. Enter or load sender's public key and your private key.
1. 输入或载入接收者的公钥和您的私钥
1. Download the decrypted file.
1. 下载解密后的文件

<br>

# [Limitations](#limitations)
局限性
---

### Folder & Multiple Files Encryption
文件夹及多文件加密

This feature is not available for security reasons. If you wish to encrypt a whole directory or multiple files then you should make a Zip and encrypt it.
出于安全原因，此特性不可用。如果您希望对整个目录或多个文件进行加密，那么应该创建一个 Zip 并对其进行加密。

### File Metadata
文件元数据

Files encrypted with hat.sh are identifiable by looking at the file signature that is used by the app to verify the content of a file, Such signatures are also known as magic numbers or Magic Bytes. These Bytes are authenticated and cannot be changed.
使用 hat.sh 加密的文件可以通过查看文件签名来识别，该文件签名被应用程序用于验证文件的内容，这种签名也被称为幻数。这些字节经过身份验证，不能更改。

### Safari and Mobile Browsers
Safari 和手机浏览器

Safari and Mobile browsers are limited to a file size of 1GB due to some issues related to service-workers. In addition, this limitation also applies when the app fails to register the service-worker (e.g FireFox Private Browsing).
Safari 和手机浏览器的文件大小被限制为1 GB，这是由于一些service-workers 相关的问题。此外，当应用程序无法使用该api时，这个限制也适用（例如火狐隐私模式）。

<br>

# [Best Practices](#best-practices)
操作推荐
---

### Choosing Passwords

选择密码

The majority of individuals struggle to create and remember passwords, resulting in weak passwords and password reuse. Password-based encryption is substantially less safe as a result of these improper practices. That's why it is recommended to use the built in password generator and use a password manager like [Bitwarden], where you are able to store the safe password.
大多数人都在创建和记住密码上感觉很困难，这导致了密码的脆弱性和密码的重复使用。由于这些不当的做法，基于密码的加密大大降低了安全性。这就是为什么建议使用内置的密码生成器，并使用像[ Bitwarden]这样的密码管理器，这样您可以存储安全的密码。

If you want to choose a password that you are able to memorize then you should type a passphrase made of 8 words or more.
如果您想选择一个您能记住的密码，那么您应该输入一个由8个或更多单词组成的密码。
<br>

### Using public key encryption instead of a password
使用密钥加密，而不是密码

If you are encrypting a file that you are going to share it with someone else then you probably should encrypt it with the recepient public key and your private key.
如果您正在加密一个将与某人共享的文件，那么您应该使用接受者的公钥和您的私钥对其进行加密。
<br>

### Sharing Encrypted Files
分享加密后的文件

If you plan on sending someone an encrypted file, it is recommended to use your private key and their public key to encrypt the file.

// here seems repeat the above paragraph
// if need, copy above character

The file can be shared in any safe file sharing app.
文件可以在任何安全的文件共享应用程序中共享。
<br>

### Sharing the public key
共享公钥

Public keys are allowed to be shared, they can be sent as `.public` file or as text.
公钥是允许共享的，它们可以作为 `. Public` 文件或文本发送。

> Never share your private key to anyone! Only public keys should be exchanged.
永远不要把你的私钥分享给任何人！只有公钥才可以交换。

<br>

### Storing the Public & Private keys
保存您的密钥

Make sure to store your encrytion keys in a safe place and make a backup to an external storage.
确保将密钥存储在安全的地方，并备份到外部存储器。

Storing your private key in cloud storage is not recommended!
不建议在云存储中存储您的私钥！

<br>

### Sharing Decryption Passwords

Sharing decryption password can be done using a safe end-to-end encrypted messaging app. It's recommended to use a _Disappearing Messages_ feature, and to delete the password after the recepient has decrypted the file.
可以使用安全的端到端加密消息应用程序来共享解密密码。建议使用 _阅后即焚_ 功能，并在接收者解密文件后删除密码。

> Never choose the same password for different files.
不要为不同的文件选择相同的密码。

<br>

# [FAQ](#faq)
问与答

---

### Does the app log or store any of my data?
该应用是否记录或存储我的数据？

No, hat.sh never stores any of your data. It only runs locally in your browser.
不，hat.sh 从不存储任何数据，它只在您的浏览器中本地运行。

<hr style="height: 1px">

### Is hat.sh free?
hat.sh免费吗？

Yes, Hat.sh is free and always will be. However, please consider [donating](https://github.com/sh-dv/hat.sh#donations) to support the project.
是的，免费并一直免费。但是请考虑[捐赠]来支持本项目。

<hr style="height: 1px">

### Which file types are supported? Is there a file size limit?
支持什么文件类型？有文件大小限制吗？

Hat.sh accepts all file types. There's no file size limit, meaning files of any size can be encrypted.
hat.sh 支持所有文件类型，没有文件大小限制，这意味着任何大小的文件都可以被加密。

Safari browser and mobile/smartphones browsers are limited to 1GB.
Safari 浏览器和手机浏览器的文件大小限制为1gb。

<hr style="height: 1px">

### I forgot my password, can I still decrypt my files?
如果我忘记了密码，我可以解密我的文件吗？

No, we don't know your password. Always make sure to store your passwords in a password manager.
不可以，我们不知道您的密码。请确保使用密码管理器来保存密码。

<hr style="height: 1px">

### Why am i seeing a notice that says "You have limited experience (max file size of 1GB)"?
为什么我看到了提示：您体验受限（文件最大为 1GB）？

It means that your browser doesn't support the server-worker fetch api. Hence, you are limited to small size files. see [Limitations](#limitations) for more info.
这意味着您的浏览器不支持server-worker api。因此，您只能操作小一点的文件。更多信息请参见[局限性]。

<hr style="height: 1px">

### Is it safe to share my public key?
共享我的公钥安全吗？

Yes. Public keys are allowed to be shared, they can be sent as `.public` file or as text.
是的。公钥是允许共享的，它们可以作为 `.Public` 文件或文本发送。

But make sure to never share your private key with anyone!
但是一定不要与任何人共享你的私钥！

<hr style="height: 1px">

### Why the app asks for my private key in the public key encryption mode"?
为什么应用要求提供我的私钥在公钥加密模式”？

Because Hat.sh uses authenticated encryption. For verification and decryption, the recepient must provide the public key that belongs to the sender, this way can verify that the encrypted file was not tampered with, and was sent from the sender.
因为 Hat.sh 使用身份验证加密。为了验证和解密，接收方必须提供属于发送方的公钥，这样可以验证加密文件没有被篡改，并且是从发送方发送的。

<hr style="height: 1px">

### I have lost my private key, is it possible to recover it?
我的私钥遗失了，可以找回来吗？

Nope. lost private keys cannot be recovered.
不行，丢失的私人密钥无法恢复。

Also, if you feel that your private key has been compromised (e.g accidentally shared / computer hacked) then you must decrypt all files that were encrypted with that key, generate a new keypair and re-encrypt the files.
此外，如果您觉得您的私钥已经被破解（例如意外地共享/计算机被黑客入侵），那么您必须解密所有用该密钥加密的文件，生成一个新的密钥对并重新加密文件。

<hr style="height: 1px">

### How do i generate a keypair (Public & Private)?
我怎样才能生成密钥对（公私密钥）？

In the encryption panel, choose Public key mode, then you can see a button that says "Generate now", make sure to [store the keys safely](#best-practices).
在加密面板中，选择公钥模式，然后您可以看到一个按钮，上面写着“现在生成”，确保[安全地存储密钥]。

<hr style="height: 1px">

### Does the app connect to the internet?
这个应用联网吗？

Once you visit the site and the page loads, it runs only offline.
一旦你访问了网站并加载了页面，它就只会离线运行。

<hr style="height: 1px">

### How can I contribute?
我该如何做贡献？

Hat.sh is an open-source application. You can help make it better by making commits on GitHub. The project is maintained in my free time. [Donations](https://github.com/sh-dv/hat.sh#donations) of any size are appreciated.
hat.sh 是一个开源应用。你可以通过在 GitHub 上提交来commits来做得更好。这个项目是我在业余时间里进行维护。任何的[捐助]都不胜感激。

<hr style="height: 1px">

### How do I report bugs?
我该如何报告问题？

Please report bugs via [Github] by opening an issue labeled with "bug".
可以在[GitHub]上提一个带有bug标签的issue

<hr style="height: 1px">

### How do I report a security vulnerability?
如何报告安全漏洞？

If you identify a valid security issue, please write an email to hatsh-security@pm.me
如果您发现了一个有效的安全问题，请写一封电子邮件给 hatsh-security@pm.me

There is no bounty available at the moment, but your github account will be credited in the acknowledgements section in the app documentation.
目前没有可获得的金钱奖励，但是您的 github 帐户将在文档的致谢中被记录。

<hr style="height: 1px">

### Why should I use hat.sh?
为什么我应该使用hat.sh

1. The app uses fast modern secure cryptographic algorithms.
2. It's super fast and easy to use.
3. It runs in the browser, no need to setup or install anything.
4. It's free opensource software and can be self hosted.

1. 这个应用使用了快速的现代安全加密算法。
2. 它超级快捷，易于使用。
3. 它在浏览器中运行，不需要安装任何东西。
4. 它是免费的开源软件，可以自我托管。

<hr style="height: 1px">

### When should I not use hat.sh?
什么情况下我不应该使用hat.sh？

1. If you want to encrypt a disk (e.g [VeraCrypt]).
1. If you want to Frequently access encrypted files (e.g [Cryptomator]).
1. If you want to encrypt multiple files and directories at once (e.g [Kryptor]).
1. If you want to encrypt files for another person that only they can decrypt (e.g [Kryptor]).
1. If you want something that adheres to industry standards, use [GPG].


1. 如果你想加密硬盘（可以使用[VeraCrypt]）
1. 如果你想经常访问加密后的文件（可以使用[Cryptomator]）
1. 如果你想一次加密多个文件目录（可以使用[Kryptor]）
1. 如果您想为另一个只有他们才能解密的人加密文件（可以使用[Kryptor]）// here i don't understand :(
1. 如果你想要符合标准的东西，请使用[GPG]
<br>

// the following part is too difficult for me. 
// sry I am not good at it. 

# [Technical Details](#technical-details)

---

### Password hashing and Key derivation

Password hashing functions derive a secret key of any size from a password and a salt.

<br>

```javascript
let salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
let key = sodium.crypto_pwhash(
  sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
  password,
  salt,
  sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
  sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
  sodium.crypto_pwhash_ALG_ARGON2ID13
);
```

The `crypto_pwhash()` function derives an 256 bits long key from a password and a salt salt whose fixed length is 128 bits, which should be unpredictable.

`randombytes_buf()` is the easiest way to fill the 128 bits of the salt.

<br>

`OPSLIMIT` represents a maximum amount of computations to perform.

`MEMLIMIT` is the maximum amount of RAM that the function will use, in bytes.

<br>

`crypto_pwhash_OPSLIMIT_INTERACTIVE` and `crypto_pwhash_MEMLIMIT_INTERACTIVE` provide base line for these two parameters. This currently requires 64 MiB of dedicated RAM. which is suitable for in-browser operations.
<br>
`crypto_pwhash_ALG_ARGON2ID13` using the Argon2id algorithm version 1.3.

<br>

### File Encryption (stream)

In order to use the app to encrypt a file, the user has to provide a valid file and a password. this password gets hashed and a secure key is derived from it with Argon2id to encrypt the file.

<br>

```javascript
let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
header = res.header;
state = res.state;

let tag = last
  ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
  : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

let encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
  state,
  new Uint8Array(chunk),
  null,
  tag
);

stream.enqueue(signature, salt, header, encryptedChunk);
```

The `crypto_secretstream_xchacha20poly1305_init_push` function creates an encrypted stream where it initializes a `state` using the key and an internal, automatically generated initialization vector. It then stores the stream header into `header` that has a size of 192 bits.

This is the first function to call in order to create an encrypted stream. The key will not be required any more for subsequent operations.

<br>

An encrypted stream starts with a short header, whose size is 192 bits. That header must be sent/stored before the sequence of encrypted messages, as it is required to decrypt the stream. The header content doesn't have to be secret because decryption with a different header would fail.

A tag is attached to each message accoring to the value of `last`, which indicates if that is the last chunk of the file or not. That tag can be any of:

1. `crypto_secretstream_xchacha20poly1305_TAG_MESSAGE`: This doesn't add any information about the nature of the message.
2. `crypto_secretstream_xchacha20poly1305_TAG_FINAL`: This indicates that the message marks the end of the stream, and erases the secret key used to encrypt the previous sequence.

The `crypto_secretstream_xchacha20poly1305_push()` function encrypts the file `chunk` using the `state` and the `tag`, without any additional information (`null`).
<br>

the XChaCha20 stream cipher Poly1305 MAC authentication are used for encryption.

`stream.enqueue()` function adds the hat.sh signature(magic bytes), salt and header followed by the encrypted chunks.

### File Decryption (stream)

```javascript
let state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);

let result = sodium.crypto_secretstream_xchacha20poly1305_pull(
  state,
  new Uint8Array(chunk)
);

if (result) {
  let decryptedChunk = result.message;
  stream.enqueue(decryptedChunk);

  if (!last) {
    // continue decryption
  }
}
```

The `crypto_secretstream_xchacha20poly1305_init_pull()` function initializes a state given a secret `key` and a `header`. The key is derived from the password provided during the decryption, and the header sliced from the file. The key will not be required any more for subsequent operations.

<br>

The `crypto_secretstream_xchacha20poly1305_pull()` function verifies that the `chunk` contains a valid ciphertext and authentication tag for the given `state`.

This function will stay in a loop, until a message with the `crypto_secretstream_xchacha20poly1305_TAG_FINAL` tag is found.

If the decryption key is incorrect the function returns an error.

If the ciphertext or the authentication tag appear to be invalid it returns an error.

<br>

### Random password generation

```javascript
let password = sodium.to_base64(
  sodium.randombytes_buf(16),
  sodium.base64_variants.URLSAFE_NO_PADDING
);
return password;
```

The `randombytes_buf()` function fills 128 bits starting at buf with an unpredictable sequence of bytes.

The `to_base64()` function encodes buf as a Base64 string without padding.

<br>

### Keys generation and exchange

```javascript
const keyPair = sodium.crypto_kx_keypair();
let keys = {
  publicKey: sodium.to_base64(keyPair.publicKey),
  privateKey: sodium.to_base64(keyPair.privateKey),
};
return keys;
```

The `crypto_kx_keypair()` function randomly generates a secret key and a corresponding public key. The public key is put into publicKey and the secret key into privateKey. both of 256 bits.

<br>

```javascript
let key = sodium.crypto_kx_client_session_keys(
  sodium.crypto_scalarmult_base(privateKey),
  privateKey,
  publicKey
);
```

Using the key exchange API, two parties can securely compute a set of shared keys using their peer's public key and their own secret key.

The `crypto_kx_client_session_keys()` function computes a pair of 256 bits long shared keys using the recepient's public key, the sender's private key.

The `crypto_scalarmult_base()` function used to compute the sender's public key from their private key.

<br>

### XChaCha20-Poly1305

XChaCha20 is a variant of ChaCha20 with an extended nonce, allowing random nonces to be safe.

XChaCha20 doesn't require any lookup tables and avoids the possibility of timing attacks.

Internally, XChaCha20 works like a block cipher used in counter mode. It uses the HChaCha20 hash function to derive a subkey and a subnonce from the original key and extended nonce, and a dedicated 64-bit block counter to avoid incrementing the nonce after each block.

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

<br>

[//]: # "links"
[xchacha20-poly1305]: https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction
[argon2id]: https://github.com/p-h-c/phc-winner-argon2
[x25519]: https://cr.yp.to/ecdh.html
[opensource]: https://github.com/sh-dv/hat.sh
[bitwarden]: https://bitwarden.com/
[extending the salsa20 nonce paper]: https://cr.yp.to/snuffle/xsalsa-20081128.pdf
[soon]: https://tools.ietf.org/html/draft-irtf-cfrg-xchacha
[github]: https://github.com/sh-dv/hat.sh
[veracrypt]: https://veracrypt.fr
[cryptomator]: https://cryptomator.org
[kryptor]: https://github.com/samuel-lucas6/Kryptor
[gpg]: https://gnupg.org
[docker hub]: https://hub.docker.com/r/shdv/hat.sh
