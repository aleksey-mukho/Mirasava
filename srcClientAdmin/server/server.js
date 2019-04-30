// @flow
const http = require("http");
const EventEmitter = require("events");
const Loadable = require("react-loadable");
const express = require("express");
const hmr = require("./hmr.js");

class Emitter extends EventEmitter {}

const emitter = new Emitter();

const serverPort = "8080";

// Server Side Rendering
const { renderPage, renderDevPage } = require("./ssr");

const PROD = process.env.NODE_ENV === "production";
const app: express$Application = express();

if (PROD) {
  app.use("/static", express.static("build"));
  app.get("*", renderPage);
} else {
  app.use("/static", express.static("build"));
  const HMR = hmr;
  // Hot Module Reloading
  HMR(app);
  app.get("*", renderDevPage);
}

// catch 404 and forward to error handler
// $FlowFixMe
app.use("*", (req, res, next) => {
  const err = new Error("Not Found");
  return next(err);
});

// development error handler
if (!PROD) {
  // $FlowFixMe
  app.use("*", (err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    console.error("error : ", err); // eslint-disable-line no-console
    return res.status(err.status || 500);
  });
}

// production error handler
// $FlowFixMe
app.use("*", (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error("error : ", err.message); // eslint-disable-line no-console
  return res.status(err.status || 500);
});

const server = http.createServer(app);
emitter.on("error", err => {
  console.error("Unexpected error on emitter", err); // eslint-disable-line no-console
});

process.on("uncaughtException", err => {
  console.error("uncaughtException", err); // eslint-disable-line no-console
});

process.on("SIGTERM", () => {
  console.info("Caught interrupt signal"); // eslint-disable-line no-console
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGINT", () => {
  // eslint-disable-next-line no-console
  console.log(
    "Mongoose default connection is disconnected due to application termination"
  );
  process.exit(0);
});

Loadable.preloadAll().then(() => {
  server.listen(serverPort, () => {
    const address = server.address();
    console.log(`👂 Listening on: localhost::${address.port}`); // eslint-disable-line no-console
  });
});
