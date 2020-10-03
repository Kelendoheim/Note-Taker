const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Displays all characters


app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: true,
        data: null,
        message: "Unable to retrieve note.",
      });
    }
    res.json({
      error: false,
      data: JSON.parse(data),
      message: "Successfully retrieved notes",
    });
  });
});

app.post("/api/db", (req, res) => {
  console.log(req.body);
  if (!req.body.title || !req.body.text) {
    return res.status(400).json({
      error: true,
      data: null,
      message: "Invalid note. Please reformat and try again.",
    });
  }
  fs.readFile("db/db.json", "utf-8", (err, data) => {
    
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: true,
        data: null,
        message: "Unable to retrieve note.",
      });
      
    }
    console.log(data);
    const updatedData = JSON.parse(data);
    updatedData.push(req.body);
    console.log(updatedData)
    fs.writeFile("db/db.json", JSON.stringify(updatedData), (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          data: null,
          message: "Unable to save new note.",
        });
      }
      res.json({
        error: false,
        data: updatedData,
        message: "Successfully added new note.",
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});