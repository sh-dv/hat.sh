/// <reference types="cypress" />
// The app has to be running in dev mode
// Tests are done on chrome
// Avoid running all test files at the same time

import { currentVersion } from "../../src/config/Constants";
import "cypress-file-upload";
import "cypress-real-events/support";

const path = require("path");
const downloadsFolder = Cypress.config("downloadsFolder");

let encryptionPassword;

describe("Symmetric encryption test", () => {
  beforeEach(() => {
    //locate app in dev mode
    cy.visit('/');

    //displays app title
    cy.contains("Hat.sh");

    //runs the correct version
    cy.contains(currentVersion);
  });

  it("loads a file and encrypt", () => {
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
    cy.get(".generatePasswordBtn").realClick();
    // save the encryption password temporarily for later use in decryption
    cy.get("#encPasswordInput")
      .invoke("val")
      .then((val) => {
        encryptionPassword = val;
        cy.log(encryptionPassword);
      });
    cy.get(".submitKeys").realClick();

    cy.wait(500);
    // click the encyption button after a file and pass were submitted
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

  it("loads a file and decrypt", () => {
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
    cy.contains("Enter the decryption password");
    cy.get(".submitKeysDec").should("be.disabled");
    cy.get(".decPasswordInput").realClick();
    // enter the encryption password that was used earlier
    cy.realType(encryptionPassword);
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

        // make sure sw responded
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
