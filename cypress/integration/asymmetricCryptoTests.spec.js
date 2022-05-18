/// <reference types="cypress" />
// The app has to be running in dev mode
// Tests are done on chrome
// Avoid running all test files at the same time

import { currentVersion, APP_URL } from "../../src/config/Constants";
import "cypress-file-upload";
import "cypress-real-events/support";

const path = require("path");
const downloadsFolder = Cypress.config("downloadsFolder");

let aliceKeys = { publicKey: null, privateKey: null };
let bobKeys = { publicKey: null, privateKey: null };

describe("Asymmetric encryption test", () => {
  beforeEach(() => {
    //locate app in dev mode
    cy.visit('/');

    //displays app title
    cy.contains("Hat.sh");

    //runs the correct version
    cy.contains(currentVersion);
  });

  it("loads a file and generate keys for two parties then encrypt", () => {
    cy.wait(2500);
    // the paht of the tested file
    const file = "../files/document.txt";
    // select the file
    cy.contains("Choose files to encrypt");
    cy.get(".submitFile").should("be.disabled");
    cy.get("#enc-file").attachFile(file);
    cy.get(".submitFile").realClick();

    cy.wait(500);
    // make sure file was submitted
    // generate random password
    cy.contains("Choose a strong Password");
    cy.get(".submitKeys").should("be.disabled");
    cy.get(".publicKeyInput").realClick();
    cy.contains("Generate now").realClick();
    cy.get(".keyPairGenerateBtn").click();

    // generate keys for alice and bob and assign to object
    cy.get("#generatedPublicKey")
      .invoke("val")
      .then((val) => {
        aliceKeys.publicKey = val;
      });

    cy.get("#generatedPrivateKey")
      .invoke("val")
      .then((val) => {
        aliceKeys.privateKey = val;
      });

    cy.log(aliceKeys);

    cy.get(".keyPairGenerateBtn").click();

    cy.get("#generatedPublicKey")
      .invoke("val")
      .then((val) => {
        bobKeys.publicKey = val;
      });

    cy.get("#generatedPrivateKey")
      .invoke("val")
      .then((val) => {
        bobKeys.privateKey = val;
      });

    cy.log(bobKeys);

    // close key pair generation window
    cy.get("#closeGenBtn").realClick();

    cy.wait(500);

    // enter decryption keys
    cy.get("#public-key-input")
      .realClick()
      .then(() => {
        // enter bob public key (recepient)
        cy.realType(bobKeys.publicKey);
      });

    cy.get("#private-key-input")
      .realClick()
      .then(() => {
        // enter alice private key (recepient)
        cy.realType(aliceKeys.privateKey);
      });

    cy.get(".submitKeys").realClick();

    cy.wait(500);
    // click the encyption button after a file and keys were submitted
    cy.window()
      .document()
      .then(function (doc) {
        doc.addEventListener("click", () => {
          setTimeout(function () {
            doc.location.reload();
          }, 2500);
        });

        // make sure sw responded
        cy.intercept("/", (req) => {
          req.reply((res) => {
            expect(res.statusCode).to.equal(200);
          });
        });

        cy.get(".downloadFile").realClick();
      });

      cy.wait(2500);
  });

  it("verify the encrypted file path", () => {
    // look up the file in the created downloads directory
    let encryptedFile = path.join(downloadsFolder, "document.txt.enc");
    // make sure a file with that name exists
    cy.readFile(encryptedFile).should("exist");
  });

  it("loads a file and decrypt using the sender public key and the recepient private key", () => {
    // visit the decryption panel
    cy.visit(`${Cypress.config('baseUrl')}/?tab=decryption`);
    cy.wait(2500);

    // the path of the encrypted file
    const file = "../downloads/document.txt.enc";
    cy.contains("Choose files to decrypt");
    cy.get(".submitFileDec").should("be.disabled");
    // select the encrypted file
    cy.fixture(file, "binary")
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get("#dec-file").attachFile({
          fileContent,
          fileName: "document.txt.enc",
          mimeType: "application/octet-stream",
          encoding: "utf-8",
          lastModified: new Date().getTime(),
        });
      });
    cy.get(".submitFileDec").realClick();
    cy.wait(500);

    // make sure file was submitted
    cy.contains("Enter sender's Public key and your Private Key");
    cy.get(".submitKeysDec").should("be.disabled");

    // enter the sender public key and the receiver private key
    cy.wait(500);

    cy.get("#public-key-input-dec")
      .realClick()
      .then(() => {
        // enter bob public key (recepient)
        cy.realType(aliceKeys.publicKey);
      });

    cy.get("#private-key-input-dec")
      .realClick()
      .then(() => {
        // enter alice private key (recepient)
        cy.realType(bobKeys.privateKey);
      });

    cy.get(".submitKeysDec").realClick();

    cy.wait(500);

    // downloads the decrypted file
    cy.window()
      .document()
      .then(function (doc) {
        doc.addEventListener("click", () => {
          setTimeout(function () {
            doc.location.reload();
          }, 2500);
        });

        //make sure sw responded
        cy.intercept("/", (req) => {
          req.reply((res) => {
            expect(res.statusCode).to.equal(200);
          });
        });

        cy.get(".downloadFileDec").realClick();
      });

      cy.wait(2500);
  });

  it("verify the decrypted file path", () => {
    // look up the file in the created downloads directory

    let decryptedFile = path.join(downloadsFolder, "document.txt");
    // make sure a file with that name exists

    cy.readFile(decryptedFile).should("exist");
  });

  it("cleans downloads folder", () => {
    //clean downloads folder
    cy.task("deleteFolder", downloadsFolder);
  });
});
