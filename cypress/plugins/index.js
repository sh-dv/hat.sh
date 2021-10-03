/// <reference types="cypress" />
/* eslint-disable no-console */
const { rmdir } = require("fs");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on("task", {
    deleteFolder(folderName) {
      console.log("deleting folder %s", folderName);

      return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err) {
            console.error(err);

            return reject(err);
          }

          resolve(null);
        });
      });
    },
  });
};
