self.addEventListener("install", (event) =>
  event.waitUntil(self.skipWaiting())
);
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

const config = require("./config");

let streamController, fileName, theKey, state, header, salt, encRx, encTx, decRx, decTx;

self.addEventListener("fetch", (e) => {
  // console.log(e); // log fetch event
  if (e.request.url.startsWith(config.APP_URL)) {
    const stream = new ReadableStream({
      start(controller) {
        streamController = controller;
      },
    });
    const response = new Response(stream);
    response.headers.append(
      "Content-Disposition",
      'attachment; filename="' + fileName + '"'
    );
    e.respondWith(response);
  }
});

const _sodium = require("libsodium-wrappers");
(async () => {
  await _sodium.ready;
  const sodium = _sodium;

  addEventListener("message", (e) => {
    switch (e.data.cmd) {
      case "prepareFileNameEnc":
        assignFileNameEnc(e.data.fileName, e.source);
        break;

      case "prepareFileNameDec":
        assignFileNameDec(e.data.fileName, e.source);
        break;

      case "requestEncryption":
        encKeyGenerator(e.data.password, e.source);
        break;

      case "requestEncKeyPair":
        encKeyPair(e.data.privateKey, e.data.publicKey, e.data.mode, e.source);
        break;

      case "asymmetricEncryptFirstChunk":
        asymmetricEncryptFirstChunk(e.data.chunk, e.data.last, e.source);
        break;

      case "encryptFirstChunk":
        encryptFirstChunk(e.data.chunk, e.data.last, e.source);
        break;

      case "encryptRestOfChunks":
        encryptRestOfChunks(e.data.chunk, e.data.last, e.source);
        break;

      case "checkFile":
        checkFile(e.data.signature, e.data.legacy, e.source);
        break;

      case "requestTestDecryption":
        testDecryption(
          e.data.password,
          e.data.signature,
          e.data.salt,
          e.data.header,
          e.data.decFileBuff,
          e.source
        );
        break;

      case "requestDecKeyPair":
        requestDecKeyPair(
          e.data.privateKey,
          e.data.publicKey,
          e.data.header,
          e.data.decFileBuff,
          e.data.mode,
          e.source
        );
        break;

      case "requestDecryption":
        decKeyGenerator(
          e.data.password,
          e.data.signature,
          e.data.salt,
          e.data.header,
          e.source
        );
        break;

      case "decryptFirstChunk":
        decryptChunks(e.data.chunk, e.data.last, e.source);
        break;

      case "decryptRestOfChunks":
        decryptChunks(e.data.chunk, e.data.last, e.source);
        break;

      case "pingSW":
        // console.log("SW running");
        break;
    }
  });

  const assignFileNameEnc = (name, client) => {
    fileName = name;
    client.postMessage({ reply: "filePreparedEnc" })
  }

  const assignFileNameDec = (name, client) => {
    fileName = name;
    client.postMessage({ reply: "filePreparedDec" })
  }

  const encKeyPair = (csk, spk, mode, client) => {
    try {
      if (csk === spk) {
        client.postMessage({ reply: "wrongKeyPair" });
        return;
      }

      let computed = sodium.crypto_scalarmult_base(sodium.from_base64(csk));
      computed = sodium.to_base64(computed);
      if (spk === computed) {
        client.postMessage({ reply: "wrongKeyPair" });
        return;
      }

      if (sodium.from_base64(csk).length !== sodium.crypto_kx_SECRETKEYBYTES) {
        client.postMessage({ reply: "wrongPrivateKey" });
        return;
      }

      if (sodium.from_base64(spk).length !== sodium.crypto_kx_PUBLICKEYBYTES) {
        client.postMessage({ reply: "wrongPublicKey" });
        return;
      }

      let key = sodium.crypto_kx_client_session_keys(
        sodium.crypto_scalarmult_base(sodium.from_base64(csk)),
        sodium.from_base64(csk),
        sodium.from_base64(spk)
      );

      if (key) {
        [encRx, encTx] = [key.sharedRx, key.sharedTx];

        if (mode === "test" && encRx && encTx) {
          client.postMessage({ reply: "goodKeyPair" });
        }

        if (mode === "derive" && encRx && encTx) {
          let res =
            sodium.crypto_secretstream_xchacha20poly1305_init_push(encTx);
          state = res.state;
          header = res.header;
          client.postMessage({ reply: "keyPairReady" });
        }
      } else {
        client.postMessage({ reply: "wrongKeyPair" });
      }
    } catch (error) {
      client.postMessage({ reply: "wrongKeyInput" });
    }
  };

  const asymmetricEncryptFirstChunk = (chunk, last, client) => {
    setTimeout(function () {
      if (!streamController) {
        console.log("stream does not exist");
      }
      const SIGNATURE = new Uint8Array(
        config.encoder.encode(config.sigCodes["v2_asymmetric"])
      );

      streamController.enqueue(SIGNATURE);
      streamController.enqueue(header);

      let tag = last
        ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
        : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

      let encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
        state,
        new Uint8Array(chunk),
        null,
        tag
      );

      streamController.enqueue(new Uint8Array(encryptedChunk));

      if (last) {
        streamController.close();
        client.postMessage({ reply: "encryptionFinished" });
      }

      if (!last) {
        client.postMessage({ reply: "continueEncryption" });
      }
    }, 500);
  };

  let encKeyGenerator = (password, client) => {
    salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

    theKey = sodium.crypto_pwhash(
      sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(theKey);
    state = res.state;
    header = res.header;

    client.postMessage({ reply: "keysGenerated" });
  };

  const encryptFirstChunk = (chunk, last, client) => {
    if (!streamController) {
      console.log("stream does not exist");
    }
    const SIGNATURE = new Uint8Array(
      config.encoder.encode(config.sigCodes["v2_symmetric"])
    );

    streamController.enqueue(SIGNATURE);
    streamController.enqueue(salt);
    streamController.enqueue(header);

    let tag = last
      ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
      : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

    let encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
      state,
      new Uint8Array(chunk),
      null,
      tag
    );

    streamController.enqueue(new Uint8Array(encryptedChunk));

    if (last) {
      streamController.close();
      client.postMessage({ reply: "encryptionFinished" });
    }

    if (!last) {
      client.postMessage({ reply: "continueEncryption" });
    }
  };

  const encryptRestOfChunks = (chunk, last, client) => {
    let tag = last
      ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
      : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

    let encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
      state,
      new Uint8Array(chunk),
      null,
      tag
    );

    streamController.enqueue(encryptedChunk);

    if (last) {
      streamController.close();
      client.postMessage({ reply: "encryptionFinished" });
    }

    if (!last) {
      client.postMessage({ reply: "continueEncryption" });
    }
  };

  const checkFile = (signature, legacy, client) => {
    if (config.decoder.decode(signature) === config.sigCodes["v2_symmetric"]) {
      client.postMessage({ reply: "secretKeyEncryption" });
    } else if (
      config.decoder.decode(signature) === config.sigCodes["v2_asymmetric"]
    ) {
      client.postMessage({ reply: "publicKeyEncryption" });
    } else if (config.decoder.decode(legacy) === config.sigCodes["v1"]) {
      client.postMessage({ reply: "oldVersion" });
    } else {
      client.postMessage({ reply: "badFile" });
    }
  };

  const requestDecKeyPair = (ssk, cpk, header, decFileBuff, mode, client) => {
    try {
      if (ssk === cpk) {
        client.postMessage({ reply: "wrongDecKeyPair" });
        return;
      }

      let computed = sodium.crypto_scalarmult_base(sodium.from_base64(ssk));
      computed = sodium.to_base64(computed);
      if (cpk === computed) {
        client.postMessage({ reply: "wrongDecKeyPair" });
        return;
      }

      if (sodium.from_base64(ssk).length !== sodium.crypto_kx_SECRETKEYBYTES) {
        client.postMessage({ reply: "wrongDecPrivateKey" });
        return;
      }

      if (sodium.from_base64(cpk).length !== sodium.crypto_kx_PUBLICKEYBYTES) {
        client.postMessage({ reply: "wrongDecPublicKey" });
        return;
      }

      let key = sodium.crypto_kx_server_session_keys(
        sodium.crypto_scalarmult_base(sodium.from_base64(ssk)),
        sodium.from_base64(ssk),
        sodium.from_base64(cpk)
      );

      if (key) {
        [decRx, decTx] = [key.sharedRx, key.sharedTx];

        if (mode === "test" && decRx && decTx) {
          let state_in = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
            new Uint8Array(header),
            decRx
          );

          if (state_in) {
            let decTestresults =
              sodium.crypto_secretstream_xchacha20poly1305_pull(
                state_in,
                new Uint8Array(decFileBuff)
              );

            if (decTestresults) {
              client.postMessage({ reply: "readyToDecrypt" });
            } else {
              client.postMessage({ reply: "wrongDecKeys" });
            }
          }
        }

        if (mode === "derive" && decRx && decTx) {
          state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
            new Uint8Array(header),
            decRx
          );

          if (state) {
            client.postMessage({ reply: "decKeyPairGenerated" });
          }
        }
      }
    } catch (error) {
      client.postMessage({ reply: "wrongDecKeyInput" });
    }
  };

  const testDecryption = (
    password,
    signature,
    salt,
    header,
    decFileBuff,
    client
  ) => {
    if (config.decoder.decode(signature) === config.sigCodes["v2_symmetric"]) {
      let decTestsalt = new Uint8Array(salt);
      let decTestheader = new Uint8Array(header);

      let decTestKey = sodium.crypto_pwhash(
        sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
        password,
        decTestsalt,
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_ALG_ARGON2ID13
      );

      let state_in = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
        decTestheader,
        decTestKey
      );

      if (state_in) {
        let decTestresults = sodium.crypto_secretstream_xchacha20poly1305_pull(
          state_in,
          new Uint8Array(decFileBuff)
        );
        if (decTestresults) {
          client.postMessage({ reply: "readyToDecrypt" });
        } else {
          client.postMessage({ reply: "wrongPassword" });
        }
      }
    }
  };

  const decKeyGenerator = (password, signature, salt, header, client) => {
    if (config.decoder.decode(signature) === config.sigCodes["v2_symmetric"]) {
      salt = new Uint8Array(salt);
      header = new Uint8Array(header);

      theKey = sodium.crypto_pwhash(
        sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
        password,
        salt,
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_ALG_ARGON2ID13
      );

      state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
        header,
        theKey
      );

      if (state) {
        client.postMessage({ reply: "decKeysGenerated" });
      }
    }
  };

  const decryptChunks = (chunk, last, client) => {
    setTimeout(function () {
      let result = sodium.crypto_secretstream_xchacha20poly1305_pull(
        state,
        new Uint8Array(chunk)
      );

      if (result) {
        let decryptedChunk = result.message;

        streamController.enqueue(new Uint8Array(decryptedChunk));

        if (last) {
          streamController.close();
          client.postMessage({ reply: "decryptionFinished" });
        }
        if (!last) {
          client.postMessage({ reply: "continueDecryption" });
        }
      } else {
        client.postMessage({ reply: "wrongPassword" });
      }
    }, 500);
  };
})();
