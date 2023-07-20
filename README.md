### hat.sh

Hat.sh is a web app that provides secure local file encryption in the browser. It's fast, secure, and uses modern cryptographic algorithms with chunked AEAD stream encryption/decryption.

V2 of hat.sh introduced memory efficient in-browser large file chunked encryption using streams with libsodium.

### Screenshots
![](https://camo.githubusercontent.com/f318a430202b6dbec2db62b84bd614720de8dda55f0f0dd362d5ea8ad33a1515/68747470733a2f2f692e696d6775722e636f6d2f4e62415a4f67502e676966)

### Features
### Security
- XChaCha20-Poly1305 - for symmetric encryption.
- Argon2id - for password-based key derivation.
- X25519 - for key exchange.
The libsodium library is used for all cryptographic algorithms.

### Privacy
- The app runs locally in your browser.
- No data is ever collected or sent to anyone.​

### Functionality
- Secure multiple file encryption/decryption with passwords or keys.
- Secure random password generation.
- Asymmetric key pair generation.
- Authenticated key exchange.
- Password strength estimation.

### Offline Use
## Deploy with Docker
### €⁠20 on [Hetzner Cloud](https://hetzner.cloud/?ref=eLtKhFK70n4h)

### Automatic Installs
```
https://github.com/WhateverItWorks/Watchtower
```

```
git clone https://github.com/WhateverItWorks/my-hat.sh-docker-compose.git hat
cd hat
nano docker-compose.yml
docker-compose up -d --build
```
http://localhost:3991


### Browser Compatibility
We officially support the last two versions of every major browser. Specifically, we test on the following

- Chrome on Windows, macOS, and Linux , Android
- Firefox on Windows, macOS, and Linux
- Safari on iOS and macOS
- Edge on Windows

Safari and Mobile browsers are limited to single 1GB files, due to lack of support with server-worker fetch api.

## Clearnet Instances

| Instance URL                                                                    | Region                           | Notes                                                                                            |
| ------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| [hat.whateveritworks.org](https://hat.whateveritworks.org)                      | Germany                          | Operated by [WhateverItWorks](https://whateveritworks.org) and [xbdm](https://xbdm.fun)          |

### Donations
The project is maintained in my free time. Donations of any size are appreciated:
<br>

<div>

<strong>Crypto</strong>

  <table>
    <tr>
      <th></th>
      <th>Coin</th>
      <th>Address</th>
    </tr>
    <tr>
      <td><img src="https://i.imgur.com/utSCHpB.png" /></td>
      <td>Monero</td>
      <td style="word-break: break-word">
        <code
          >adding soon</code
        >
      </td>
    </tr>
    <tr>
      <td><img src="https://i.imgur.com/imvYFLR.png" /></td>
      <td>Bitcoin</td>
      <td><code>adding soon</code></td>
    </tr>
    <tr>
      <td><img src="https://i.imgur.com/a4vLbjm.png" /></td>
      <td>Ethereum</td>
      <td><code>adding soon</code></td>
    </tr>
  </table>


## Acknowledgements

- Everyone who supported the project.
- [Samuel-lucas6](https://github.com/samuel-lucas6) from the [Kryptor](https://github.com/samuel-lucas6/Kryptor) project for being helpful and doing a lot of beta testing.
- [stophecom](https://github.com/stophecom) from the [Scrt.link](https://scrt.link/) project for translating to German.
- [bbouille](https://github.com/bbouille) for translating to French.
- [qaqland](https://github.com/qaqland) for translating to Chinese.
- [Ser-Bul](https://github.com/Ser-Bul) for translating to Russian.
- [matteotardito](https://github.com/matteotardito) for translating to Italian.
- [t0mzSK](https://github.com/t0mzSK) for translating to Slovak.
- [Xurdejl](https://github.com/Xurdejl) for translating to Spanish.
- [Franatrtur](https://github.com/Franatrtur) for translating to Czech.
- [darkao](https://github.com/darkao) for translating to Turkish.
- [Frank7sun](https://github.com/Frank7sun) for translating to Japanese.


## Credits

[libsodium.js](https://github.com/jedisct1/libsodium.js)

[next.js](https://nextjs.org/)

[material-ui](https://material-ui.com/)


## Security Audits:

- [Internet.nl](https://internet.nl/site/hat.whateveritworks.org)
- [HSTS Preload](https://hstspreload.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=hat.whateveritworks.org)
- [Security Headers](https://securityheaders.com/?q=hat.whateveritworks.org&hide=on&followRedirects=on)
- [pagespeed](https://pagespeed.web.dev/)
- [webbkoll](https://webbkoll.dataskydd.net/en)
- [ImmuniWeb](https://www.immuniweb.com/ssl/hat.whateveritworks.org)
- [Hardenize](https://www.hardenize.com/report/hat.whateveritworks.org)
- [Mozilla.org](https://observatory.mozilla.org/)
- [report-uri.com](https://report-uri.com/home/tools)
- [check-your-website.server-daten.de](https://check-your-website.server-daten.de/?q=hat.whateveritworks.org)
- [csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com/)
- [OpenWPM](https://github.com/openwpm/OpenWPM)
- [privacyscore.org](https://privacyscore.org/)
