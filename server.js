const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Connection created");
});

//Task 1
app.post("/form", (req, res) => {
  try {
    const { id, name, subscribe } = req.body;
    const data = {
      id: id,
      fields: [
        { type: "text", label: "Name", value: name },
        { type: "checkbox", label: "Subscribe", value: subscribe },
      ],
    };
    const result = JSON.stringify(data);
    fs.writeFile("task.json", result, function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
    res.status(201).json({ message: "File Created Successfully!" });
  } catch (err) {
    res.status(401).json({ message: `Error while submitting form ${err}` });
  }
});

app.get("/form", (req, res) => {
  try {
    fs.readFile("./task.json", function (err, data) {
      if (err) throw err;
      console.log("File Opened!");
      const task = JSON.parse(data);
      res.send(task);
    });
  } catch (err) {
    res.status(401).json({ message: `Error while submitting form ${err}` });
  }
});
//------------------------------------------------------------------------------

//Task-2
app.post("/register", async (req, res) => {
  try {
    const { id, username, password } = req.body;
    const pass = password;
    const salt = await bcrypt.genSalt();
    const encrypted = await bcrypt.hash(pass, salt);
    console.log("encrypted: ", encrypted);
    const data = {
      id,
      username,
      password: encrypted,
    };
    fs.writeFile("Register.json", JSON.stringify(data), function (err) {
      if (err) throw err;
      console.log("Register File created");
    });
    res.status(201).json({ message: "User Registered Successfully!" });
  } catch (error) {
    res.status(401).json({ message: `Error while registering user ${error}` });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    fs.readFile("./Register.json", async function (err, data) {
      if (err) throw err;
      const user = JSON.parse(data);
      const decrypted = await bcrypt.compare(password, user.password);
      if (decrypted) {
        res.send(`Hello ${username}`);
      } else {
        res.status(401).json({ message: "Password or username is Wrong." });
      }
    });
  } catch (error) {}
});
//---------------------------------------------------------
app.listen(3000, () => {
  console.log("Server connection at http://localhost:3000");
});
