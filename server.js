const express = require("express");
const { AsyncLocalStorage } = require("async_hooks");
const { v4 } = require("uuid");

const app = express();
const port = 8888;

const asyncLocalStorage = new AsyncLocalStorage();

app.use(express.json());

app.use((req, res, next) => {
  const requestId = v4();
  req._id = requestId;
  console.log(`middleware: [${requestId}]`);
  asyncLocalStorage.run(requestId, () => {
    next();
    console.log("hi");
  });
});

const wait = async (t) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      log("promise");
      res(1);
    }, t * 1000);
  });
};

function log(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`[${id}]: ${msg}`);
}

app.get("/", async (req, res) => {
  // asyncLocalStorage.run(req._id, () => {
  //   const id = asyncLocalStorage.getStore();
  //   console.log(id);
  //   res.send("Hello World!");
  // });
  log("hello");
  await wait(0.1);

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
