const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5009;

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello from cyclic");
});

app.listen(PORT, console.log(`Listening on ${PORT}`));
