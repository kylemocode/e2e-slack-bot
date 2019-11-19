const server = require("server");
const { get, post } = server.router;
const admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e2e-dino.firebaseio.com/"
});

let db = admin.database();
let runnerRef = db.ref("/runner");
let isRunningRef = db.ref("/isRunning");

server({ port: 8082, security: { csrf: false } }, [
  get("/", ctx => "Hello world!!"),
  post("/", async ctx => {
    let isRunning;
    const data = ctx.data.text;
    const dataList = data.split(" ");
    await isRunningRef.once("value", async snapshot => {
      if (snapshot.val().isRunning == true) {
        isRunning = true;
      } else {
        await runnerRef.set({
          branch: dataList[1],
          type: dataList[0],
          timestamp: new Date().getTime()
        });
        isRunning = false;
      }
    });

    if (isRunning === true) {
      return "E2E server is running, please wait...";
    } else {
      return `Ready to test ${dataList[0]} platform, on branch ${dataList[1]}`;
    }
  })
]);
