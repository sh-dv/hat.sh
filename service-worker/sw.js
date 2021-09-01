self.addEventListener("install", (event) =>
  event.waitUntil(self.skipWaiting())
);
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

const APP_URL = "http://localhost:3000" + "/file";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const sigCodes = {
  v1: "Encrypted Using Hat.sh",
  v2: "zDKO6XYXioc",
};
const SIGNATURE = new Uint8Array(encoder.encode(sigCodes["v2"]));

let streamController, theKey, state, header, salt;

// decode base64 url
function b64_to_utf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

self.addEventListener("fetch", (e) => {
  // console.log(e); // log fetch event
  if (e.request.url.startsWith(APP_URL)) {
    const filename = b64_to_utf8(e.request.url.split("?name=")[1]);
    const stream = new ReadableStream({
      start(controller) {
        streamController = controller;
      },
    });
    const response = new Response(stream);
    response.headers.append(
      "Content-Disposition",
      'attachment; filename="' + filename + '"'
    );
    e.respondWith(response);
  }
});

const _sodium = require("libsodium-wrappers");
(async () => {
  await _sodium.ready;
  const sodium = _sodium;
  //check if libsodium is ready
  // console.log("sodium is ready to be used");

  addEventListener("message", (e) => {
    // console.log(e.data);

    switch (e.data.cmd) {
      case "requestEncryption":
        // console.log("received encryption request!");
        encKeyGenerator(e.data.password, e.source);
        break;

      case "encryptFirstChunk":
        // console.log("received encryption request for first chunk!");
        encryptFirstChunk(e.data.chunk, e.data.last, e.source);
        break;

      case "encryptRestOfChunks":
        // console.log("received encryption request for rest of chunks!");
        encryptRestOfChunks(e.data.chunk, e.data.last, e.source);
        break;

      case "requestDecryption":
        // console.log("received decryption request!");
        decKeyGenerator(
          e.data.password,
          e.data.signature,
          e.data.salt,
          e.data.header,
          e.source
        );
        break;

      case "decryptFirstChunk":
        // console.log("received decryption request for first chunk!");
        decryptChunks(e.data.chunk, e.data.last, e.source);
        break;

      case "decryptRestOfChunks":
        // console.log("received decryption request for rest of chunks!");
        decryptChunks(e.data.chunk, e.data.last, e.source);
        break;

      case "requestTestDecryption":
        // console.log("received decryption test request!");
        testDecryption(
          e.data.password,
          e.data.signature,
          e.data.salt,
          e.data.header,
          e.data.decFileBuff,
          e.source
        );
        break;
    }
  });

  let encKeyGenerator = (password, client) => {
    salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    // console.log("salt", salt);

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
    // console.log("encrytped chunk", encryptedChunk);

    streamController.enqueue(new Uint8Array(encryptedChunk));

    if (last) {
      streamController.close();
      // console.log("done encrypting");
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
    // console.log("encryptedChunk", encryptedChunk);

    streamController.enqueue(encryptedChunk);

    if (last) {
      streamController.close();
      // console.log("done encrypting");
      client.postMessage({ reply: "encryptionFinished" });
    }

    if (!last) {
      client.postMessage({ reply: "continueEncryption" });
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
    if (decoder.decode(signature) === sigCodes["v2"]) {
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
        // console.log("dec file buff", decFileBuff);
        // console.log("state in", state_in);

        let decTestresults = sodium.crypto_secretstream_xchacha20poly1305_pull(
          state_in,
          new Uint8Array(decFileBuff)
        );
        if (decTestresults) {
          // console.log("good key");
          // console.log("ready to decrypt!");
          client.postMessage({ reply: "readyToDecrypt" });
        } else {
          client.postMessage({ reply: "wrongPassword" });
        }
      }
    } else if (decoder.decode(signature) === sigCodes["v1"].slice(0, 11)) {
      // console.log("old verion!")
      client.postMessage({ reply: "oldVersion" });
    } else {
      // console.log("Bad file, or not encrypted using hat.sh V2");
      client.postMessage({ reply: "badFile" });
    }
  };

  const decKeyGenerator = (password, signature, salt, header, client) => {
    if (decoder.decode(signature) === sigCodes["v2"]) {
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
        // console.log("dec keys generated!");
        client.postMessage({ reply: "decKeysGenerated" });
      }
    } else {
      // console.log("Bad file, or not encrypted using hat.sh V2");
      client.postMessage({ reply: "badFile" });
    }
  };

  const decryptChunks = (chunk, last, client) => {
    // console.log("chunk", chunk);
    // console.log("last:", last);
    // console.log("state", state);

    let result = sodium.crypto_secretstream_xchacha20poly1305_pull(
      state,
      new Uint8Array(chunk)
    );

    if (result) {
      // console.log("good key");

      let decryptedChunk = result.message;

      // console.log("decrypted chunk", decryptedChunk);

      streamController.enqueue(new Uint8Array(decryptedChunk));

      if (last) {
        streamController.close();
        // console.log("done decrypting");
        client.postMessage({ reply: "decryptionFinished" });
      }
      if (!last) {
        // console.log("need to decrypt more");
        client.postMessage({ reply: "continueDecryption" });
      }
    } else {
      client.postMessage({ reply: "wrongPassword" });
    }
  };
})();
