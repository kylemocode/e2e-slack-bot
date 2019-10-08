const admin = require('firebase-admin');

const shell = require('shelljs');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://e2e-dino.firebaseio.com/'
});


var db = admin.database();
var ref = db.ref("/");
ref.once("child_changed", function (snapshot) {
  const data = snapshot.val();
  console.log(data);
  const {
    branch,
    type,
  } = data;
  shell.exec(`echo 'Roger, I will start to test "${type}" on this branch(${branch})'`);
  // TODO
  /**
   * 1. 是否可以執行？ running
   * 2. 執行某個測試
   */
});