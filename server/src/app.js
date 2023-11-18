const express = require("express");
const cors = require("cors");
const expressStaticGzip = require("express-static-gzip");
const path = require("path");
require('dotenv').config()
const userRouter = require('./routes/userRouter')
const hackathonRouter = require('./routes/hackathonRouter');


const STATIC_FOLDER = path.join(__dirname, "../", "../", "client/", "build/");
const HTTP_PORT = Number(process.env.HTTP_PORT || 5000);

const app = express();
app.use(express.json());
app.use(cors());



app.use('/', userRouter);
app.use('/', hackathonRouter);
app.get("/myvar",(_, res) => res.json({MY_VAR: myVar}))


app.use(expressStaticGzip(STATIC_FOLDER));
app.get("*", expressStaticGzip(STATIC_FOLDER));
app.use("*", expressStaticGzip(STATIC_FOLDER));

async function listen() {
  await app.listen(HTTP_PORT);

  console.log(`Serving files in ${STATIC_FOLDER} on port ${HTTP_PORT}`);
}

module.exports = {
  app,
  listen,
};
