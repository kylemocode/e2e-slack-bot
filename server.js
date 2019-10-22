const admin = require("firebase-admin");
const shell = require("shelljs");
const slackWebClient = require("./slackAPI");
let serviceAccount = require("./serviceAccountKey.json");
require("dotenv").config();

console.log("Testing server is running...");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e2e-dino.firebaseio.com/"
});

let db = admin.database();
let runnerRef = db.ref("/runner");
let isRunningRef = db.ref("/isRunning");
let cancelRef = db.ref("/cancel");
let isRunning = false;
let firstRun = true;

isRunningRef.on("value", snapshot => {
  if (snapshot.val().isRunning == true) {
    isRunning = true;
  } else {
    isRunning = false;
  }
});

runnerRef.on("value", async function(snapshot) {
  // dont't exec shell script when server first run
  if (firstRun) {
    firstRun = false;
    return;
  }

  const data = snapshot.val();
  const { branch, type } = data;

  if (isRunning) {
    await slackWebClient.chat.postMessage({
      channel: "e2e-bot",
      text: "Test server is running, please wait..."
    });
    return;
  } else {
    await isRunningRef.set({
      isRunning: true
    });
    await slackWebClient.chat.postMessage({
      channel: "e2e-bot",
      text: "E2E testing start..."
    });
  }

  shell.exec(`source server.sh ${type} ${branch}`, async function(
    code,
    stdout,
    stderr
  ) {
    await isRunningRef.set({
      isRunning: false
    });

    await slackWebClient.chat.postMessage({
      channel: "e2e-bot",
      text: checkStatus(code)
    });
  });
});

function checkStatus(code) {
  switch (code) {
    case 0:
      return "Test finish, check your result right now.";
    case 1:
      return "Test fail, please check the server...";
    case 2:
      return "Build fail, please check the server...";
  }
}
