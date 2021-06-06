const _sodium = require("libsodium-wrappers");
(async () => {
  await _sodium.ready;
  const sodium = _sodium;
  //check if libsodium is ready
  // console.log("sodium is ready to be used");

  //ui parameters
  const encFileWrapper = document.getElementById("encFileWrapper"),
        encFileArea = document.getElementById("encFileArea"),
        encFileAreaInfo = document.getElementById("encFileAreaInfo"),
        encFileAreaText = document.getElementById("encFileAreaText"),
        encFileBrowseBtn = document.getElementById("encFileBrowseBtn"),
        encFileInput = document.getElementById("encFileInput"),
        encPasswordField = document.getElementById("encPasswordField"),
        generatePasswordBtn = document.getElementById("generatePasswordBtn"),
        encPasswordInput = document.getElementById("encPasswordInput"),
        encRequestBtn = document.getElementById("encRequestBtn"),
        encBtn = document.getElementById("encBtn"),
        encModal = document.getElementById("encModal"),
        encModalCloseBtn = document.getElementById("encModalCloseBtn"),
        copyPasswordBtn =  document.getElementById("copyPassword"),

        decFileWrapper = document.getElementById("decFileWrapper"),
        decFileArea = document.getElementById("decFileArea"),
        decFileAreaInfo = document.getElementById("decFileAreaInfo"),
        decFileAreaText = document.getElementById("decFileAreaText"),
        decFileBrowseBtn = document.getElementById("decFileBrowseBtn"),
        decFileInput = document.getElementById("decFileInput"),
        decPasswordField = document.getElementById("decPasswordField"),
        decPasswordInput = document.getElementById("decPasswordInput"),
        decRequestBtn = document.getElementById("decRequestBtn"),
        decPasswordCheckBtn = document.getElementById("decPasswordCheckBtn"),
        decBtn = document.getElementById("decBtn"),
        decModal = document.getElementById("decModal"),
        decModalCloseBtn = document.getElementById("decModalCloseBtn"),

        errorArea = document.getElementById("errorArea"),
        supportModal = document.getElementById("supportModal"),
        overlay = document.getElementById("overlay");
    
  
  const CHUNK_SIZE = 64 * 1024 * 1024;

  let file, password, index, decFileBuff, DecPermitStatus = false;




  //register service worker
  if ("serviceWorker" in navigator) {
        navigator.serviceWorker
        .register("sw-build.js")
        .then((reg) => {reg.update()})
        .catch((err) => {console.log("ServiceWorker registration failed", err)});
  }



  //check if browser is safari and throw error  
    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
      let supModal = new bootstrap.Modal(supportModal, {});
      supModal.show();
  }
  
  //detect mobile browsers
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      let supModal = new bootstrap.Modal(supportModal, {});
      supModal.show();
  }
    

  //file size formatter
  const formatBytes = (bytes, decimals) => {
    if (bytes == 0) return "0 Bytes";
    let k = 1024,
      dm = decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  
  
  //error message handler
  const showError = (msg) => {
    errorArea.innerHTML = 
    `<div class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="fas fa-exclamation-circle"></i> ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
  
  //enc ui => show file info when selected
  const showEncFileInfo = () => {
  
      file = encFileInput.files[0];
  
      if (file) {
        encFileWrapper.classList.add("shadow-lg");
        encFileWrapper.classList.add("bg-white");
        encFileArea.classList.add("active");
        encFileAreaText.textContent = "";
        encFileBrowseBtn.textContent = "Change File";
        encFileBrowseBtn.classList.add("contains");
        encPasswordField.style.display = 'flex';
        encFileAreaInfo.innerHTML = file.name + "<br>" + formatBytes(file.size);
      }
    
      if(!file){
        encFileAreaText.innerHTML = "choose a file to encrypt"
        encFileAreaInfo.innerHTML = '';
        encPasswordField.style.display = 'none';
        encFileWrapper.classList.remove("shadow-lg")
        encFileWrapper.classList.remove("bg-white");
      }
  }
  

  //enc ui => if a file and a password are chosen, show the encrypt button
  const showEncBtn = () => {
     
      if(encPasswordInput.value) {
        encRequestBtn.style.display = 'block';
      } else {
        encRequestBtn.style.display = 'none';
      } 
  
      if (encPasswordInput && encPasswordInput.value != '') {
        encPasswordInput.classList.remove("is-invalid");
        encPasswordInput.classList.add("is-valid");
      }
  
      if(encPasswordInput.value == ''){
        encPasswordInput.classList.add("is-invalid");
      }
  }
  
  
  //enc ui => password generation function
  const generateKey = () => { 
    encPasswordInput.value = sodium.to_base64(sodium.randombytes_buf(16), sodium.base64_variants.URLSAFE_NO_PADDING);
    showEncBtn();
  }
  
  //enc ui => encryption form reset function
  const resetEncInputs = () => {
    encFileInput.value = '';
    encPasswordInput.value = '';
    encFileBrowseBtn.textContent = "Browse File";
    encFileAreaText.innerHTML = "choose a file to encrypt"
    encFileAreaInfo.innerHTML = '';
    encPasswordField.style.display = 'none';
    encRequestBtn.style.display = 'none';
    encFileWrapper.classList.remove("shadow-lg")
    encFileWrapper.classList.remove("bg-white");
    encPasswordInput.classList.remove("is-valid");
    encPasswordInput.classList.remove("is-invalid");
  }
  
  
  //enc ui => if user click on the file browse button then the input also clicked
  encFileBrowseBtn.onclick = () => {encFileInput.click();};
  //enc ui => if file is selected, show file info
  encFileInput.addEventListener("change", showEncFileInfo, false);
  //enc ui => generate password on btn click
  generatePasswordBtn.onclick = () => {generateKey();}
  //enc ui => show enc btn when password is being filled
  encPasswordInput.addEventListener('keyup', showEncBtn);
  //enc ui => reset inputs when closing enc modal
  encModalCloseBtn.onclick = () => {resetEncInputs()}
  
  //enc ui => password copy function
  copyPasswordBtn.onclick = () => {
      const el = document.createElement('textarea');
      el.value = password;
      document.getElementById('copyPasswordInput').appendChild(el);
      el.select();
      document.execCommand('Copy');
      document.getElementById('copyPasswordInput').removeChild(el);
      document.getElementById('copyPasswordTitle').innerHTML = "Copied!";
      setTimeout(() => {
        document.getElementById('copyPasswordTitle').innerHTML = "Decryption Password!";
      }, 5000);
    };




  //dec ui => show file info when selected
  const showDecFileInfo = () => {
  
    file = decFileInput.files[0];
  
    if (file) {
      decFileWrapper.classList.add("shadow-lg");
      decFileWrapper.classList.add("bg-white");
      decFileArea.classList.add("active");
      decFileAreaText.textContent = "";
      decFileBrowseBtn.textContent = "Change File";
      decFileBrowseBtn.classList.add("contains");
      decPasswordField.style.display = 'flex';
      decFileAreaInfo.innerHTML = file.name + "<br>" + formatBytes(file.size);
      decPasswordInput.classList.remove("is-invalid");
      errorArea.innerHTML = '';
    }
  
    if(!file){
      decFileAreaText.innerHTML = "choose a file to encrypt"
      decFileAreaInfo.innerHTML = '';
      decPasswordField.style.display = 'none';
      decFileWrapper.classList.remove("shadow-lg")
      decFileWrapper.classList.remove("bg-white");
      decPasswordInput.classList.remove("is-invalid");
      errorArea.innerHTML = '';
    }
  }
  
  //dec ui => if a file and a password are chosen, show the decrypt button
  const showDecBtn = () => {
    if(decPasswordInput.value) {
      decRequestBtn.style.display = 'block';
    } else {
      decRequestBtn.style.display = 'none';
    } 
  }
  
  
  //dec ui => decryption form reset function
  const resetDecInputs = () => {
    decFileInput.value = '';
    decPasswordInput.value = '';
    decFileBrowseBtn.textContent = "Browse File";
    decFileAreaText.innerHTML = "choose a file to decrypt"
    decFileAreaInfo.innerHTML = '';
    decPasswordField.style.display = 'none';
    decRequestBtn.style.display = 'none';
    decFileWrapper.classList.remove("shadow-lg")
    decFileWrapper.classList.remove("bg-white");
    decPasswordInput.classList.remove("is-invalid");
  }
  

  //dec ui => if user click on the file browse button then the input also clicked
  decFileBrowseBtn.onclick = () => {decFileInput.click();};
  //dec ui => if file is selected, show file info
  decFileInput.addEventListener("change", showDecFileInfo, false);
  //dec ui => show dec btn when password is being filled
  decPasswordInput.addEventListener('keyup', showDecBtn);
  decPasswordInput.addEventListener('change', showDecBtn);
  //dec ui => reset inputs when closing enc modal
  decModalCloseBtn.onclick = () => {resetDecInputs()}





navigator.serviceWorker.ready.then((reg) => {
    // console.log('sw is ready');

    encRequestBtn.addEventListener("click", (e) => {

      file = encFileInput.files[0];
      password = encPasswordInput.value;

      if (!file) return showError("Please choose a file and enter a password!");
      if (!password) return showError("Please choose a file and enter a password!");
      
      showEncModal();
      
    });

    
    encBtn.addEventListener("click", (e) => {
        file = encFileInput.files[0];
        password = encPasswordInput.value;
        if (!file) return e.preventDefault();
        if (!password) return e.preventDefault();
        
        // console.log('enc clicked');
        
        e.target.setAttribute('href', '/file?name=' + file.name + '.enc');
        
        requestEncryption(password);
        
     
    });

    decRequestBtn.addEventListener("click", (e) => {
        file = decFileInput.files[0];
        password = decPasswordInput.value;
        if (!file) return showError("Please choose a file and enter a password!");
        if (!password) return showError("Please choose a file and enter a password!");

        // console.log('dec req clicked');

        decPasswordCheckBtn.style.display = 'block';
        decRequestBtn.style.display = 'none';

        testDecryption(password);

    });
    

    decBtn.addEventListener("click", (e) => {
      if (!DecPermitStatus) return e.preventDefault();
      file = decFileInput.files[0];
      password = decPasswordInput.value;
      if (!file) return showError("Please choose a file and enter a password!");
      if (!password) return showError("Please choose a file and enter a password!");

      // console.log('dec clicked');

      e.target.setAttribute('href', '/file?name=' + file.name.slice(0, -4)); // slice off .enc suffix (ToDo: validate file input)

      requestDecryption(password);

  });


    const showEncModal = () => {
      errorArea.innerHTML = '';
      let myEncModal = new bootstrap.Modal(encModal, {});
      document.getElementById("encModalFileName").innerHTML = file.name;
      document.getElementById("copyPasswordInput").value = password;
      myEncModal.show();
    }

    const requestEncryption = (password) => {

      reg.active.postMessage(
        { cmd: 'requestEncryption', password}
      );
      // console.log('request enc')
    }

    const startEncryption = () => {
      file = encFileInput.files[0];

      file.slice(0, CHUNK_SIZE).arrayBuffer().then(chunk => {
        index = CHUNK_SIZE;
        reg.active.postMessage({cmd: 'encryptFirstChunk', chunk, last: index >= file.size}, [chunk]); // transfer chunk ArrayBuffer to service worker
      });
    }

    const continueEncryption = (e) => {
      file = encFileInput.files[0];

      file.slice(index, index + CHUNK_SIZE).arrayBuffer().then(chunk => {
        index += CHUNK_SIZE;
        e.source.postMessage({cmd: 'encryptRestOfChunks', chunk, last: index >= file.size}, [chunk]); // transfer chunk ArrayBuffer to service worker
      });
    }


    const testDecryption = (password) => {

      file = decFileInput.files[0];

      Promise.all([
          file.slice(0, 11).arrayBuffer(), //signature
          file.slice(11, 27).arrayBuffer(), //salt
          file.slice(27, 51).arrayBuffer(), //header
          file.slice(51, 51 + CHUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES).arrayBuffer() //17
        ]).then(([signature, salt, header, chunk]) => {
          decFileBuff = chunk; //for testing the dec password
          reg.active.postMessage(
            { cmd: 'requestTestDecryption', password, signature, salt, header, decFileBuff}, 
          );
        });

      // console.log('request dec test')
    }

    const wrongDecPassword = () => {
      decPasswordInput.classList.add("is-invalid");
      decPasswordCheckBtn.style.display = 'none';
      decRequestBtn.style.display = 'block';
      showError("You have entered a wrong password!");
      decPasswordInput.focus();
    }

    const badFile = () => {
      decPasswordCheckBtn.style.display = 'none';
      decRequestBtn.style.display = 'block';
      showError("Bad file, or was not encrypted using hat.sh V2!");
    }
    
    const showDecryptModal = () => {
        DecPermitStatus = true;
        decPasswordCheckBtn.style.display = 'none';
        errorArea.innerHTML = '';
        let myDecModal = new bootstrap.Modal(decModal, {});
        document.getElementById("decModalFileName").innerHTML = file.name;
        myDecModal.show();
    }

    const requestDecryption = (password) => {

      file = decFileInput.files[0];

      Promise.all([
          file.slice(0, 11).arrayBuffer(), //signature
          file.slice(11, 27).arrayBuffer(), //salt
          file.slice(27, 51).arrayBuffer(), //header
          file.slice(51, 51 + CHUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES).arrayBuffer() //17
        ]).then(([signature, salt, header, chunk]) => {
          reg.active.postMessage(
            { cmd: 'requestDecryption', password, signature, salt, header}, 
          );
        });

      // console.log('request dec')
    }



    const startDecryption = () => {

      file = decFileInput.files[0];
 
        file.slice(51, 51 + CHUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES).arrayBuffer().then(chunk => {
          index = 51 + CHUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES;
          reg.active.postMessage({cmd: 'decryptFirstChunk', chunk, last: index >= file.size}, [chunk]); // transfer chunk ArrayBuffer to service worker
        });
    }

    const continueDecryption = (e) => {
     
      file = decFileInput.files[0];

        file.slice(index, index + CHUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES).arrayBuffer().then(chunk=> {
          index += CHUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES; // 16 byte iv, 128 MB chunk, 16 byte (128bit) authTag 
          e.source.postMessage({cmd: 'decryptRestOfChunks', chunk, last: index >= file.size}, [chunk]);
        });
  
    }



    navigator.serviceWorker.addEventListener("message", (e) => {

      switch(e.data.reply){
        case "keysGenerated":
          // console.log('keys generated!');
          startEncryption();
          break;
          
        case "continueEncryption":
          // console.log('need to encrypt more chunks!');
          continueEncryption(e);
          break;

        case "encryptionFinished":
          // console.log('encrypted!');
          break;
        
        case "wrongPassword":
          // console.log('wrong password');
          wrongDecPassword();
          break;

        case "badFile":
          badFile();
          break;

        case "readyToDecrypt":
          // console.log('all is ok, decryption should start now! reveal button');
          showDecryptModal();
          break;

        case "decKeysGenerated":
          // console.log('dec keys generated!');
          startDecryption();
          break;

        case "continueDecryption":
          // console.log('need to decrypt more chunks!');
          continueDecryption(e);
          break;

      }

    });

});




})();