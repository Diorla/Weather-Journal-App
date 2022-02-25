const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const port = 1960;

const app = express();

let projectData = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("static"));

app.listen(port, () => {
  console.log(`server up and running at ${port}`);
});

app.get("/", (_req, res) => {
  res.sendFile(path.resolve("pages/index.html"));
});

app.get("/weather", (req, res) => {
  res.json(projectData);
});

app.post("/weather", (req, res) => {
  projectData = req.body;
});
