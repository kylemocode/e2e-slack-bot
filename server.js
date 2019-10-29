const admin = require("firebase-admin");
const shell = require("shelljs");
const fs = require("fs");
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
let isRunning = false;
let firstRun = true;
let shellProcess;


isRunningRef.on("value", snapshot => {
  if (snapshot.val().isRunning == true) {
    isRunning = true;
  } else {
    isRunning = false;
  }
});

runnerRef.on("value", async function(snapshot) {
  const data = snapshot.val();
  const { branch, type } = data;
  let localBranch;
  let isRemoteBranch = branch.includes("/");
  if(isRemoteBranch) {
    localBranch = branch.split('/').pop();
  }else {
    localBranch = branch;
  }
  // dont't exec shell script when server first run
  if (firstRun) {
    shell.exec(`./pythonServer.sh ${localBranch}`, { async: true });
    firstRun = false;
    return;
  }
  
  if (isRunning) {
    await slackWebClient.chat.postMessage({
      channel: "e2e-bot",
      text: "Test server is running, please wait..."
    });
    return;
  } else  {
    await isRunningRef.set({
      isRunning: true
    });
    await slackWebClient.chat.postMessage({
      channel: "e2e-bot",
      text: "E2E testing start..."
    });

    shellProcess = shell.exec(
      `source server.sh ${type} ${branch}`,
      async function(code, stdout, stderr) {
        if (stderr && code !== 0) {
          const now = new Date();
          const month = now.getMonth();
          const day = now.getDate();
          const hour = now.getHours();
          const minute = now.getMinutes();
          var fileName = `${month+1}-${day}-${hour}-${minute}.html`
          fs.writeFileSync(
            `./error-log/${localBranch}/${month+1}-${day}-${hour}-${minute}.html`,
            '<pre>'+stderr+'</pre>',
            'utf8'
          );
        }
  
        await isRunningRef.set({
          isRunning: false
        });
  
        await slackWebClient.chat.postMessage({
          channel: "e2e-bot",
          text: checkStatus(code,fileName,localBranch)
        });
  
      }
    );
  }
});


function checkStatus(code, fileName,branch) {
  switch (code) {
    case 0:
      return "Test finish and pass, check your result right now.";
    case 1:
      return `Test fail.....please checkout the error log at : ${process.env.IP_ADDRESS}${branch}/${fileName}`;
    default:
      return "There are some unexpected events occured....";
  }
}
