### Testing with cypress

- cypress and it's dependencies have to be installed
- The app has to be running in dev mode
- Tests are done on chrome
- Avoid running all test files at the same time

<br>

move to the hat.sh app root directory

`cd hat.sh`

install cypress/dependencies:

`npm install cypress@8.7.0 cypress-file-upload@5.0.8 cypress-real-events@1.5.1 --save-dev`

run the app in dev enviroment: 

`npm run dev`

start cypress testing :

`npm run test`

