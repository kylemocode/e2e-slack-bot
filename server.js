const admin = require("firebase-admin");
const shell = require("shelljs");
let serviceAccount = require("./serviceAccountKey.json");

console.log("Testing server is running...");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e2e-dino.firebaseio.com/"
});

let db = admin.database();
let runnerRef = db.ref("/runner");
let isRunningRef = db.ref("/isRunning");
let slackMsgRef = db.ref("/slackMessage");
let isRunning = false;
let firstRun = true;

runnerRef.on("value", async function(snapshot) {
  // dont't exec shell script when server first run
  if (firstRun) {
    firstRun = false;
    return;
  }

  const data = snapshot.val();
  const { branch, type } = data;
  await isRunningRef.once("value", snapshot => {
    if (snapshot.val().isRunning == true) {
      isRunning = true;
    }
  });
  if (isRunning) {
    console.log("Test server is running, please wait...");
    slackMsgRef.set({
      message: "Test server is running, please wait..."
    });
    return;
  } else {
    isRunningRef.set({
      isRunning: true
    });
  }
  shell.exec(
    `echo 'Roger, I will start to test "${type}" on this branch(${branch})'`
  );
  // give permission to shell script
  shell.exec("chmod 755 server.sh");
  shell.exec(`./server.sh ${type} ${branch}`);
  isRunningRef.set({
    isRunning: false
  });
  slackMsgRef.set({
    message: "Test finish, check your result right now."
  });
});
