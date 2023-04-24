const express = require("express");
const fs = require("fs");
const path = require("path");
// Helper method for generating unique ids
const uniqid = require("uniqid");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", function (req, res) {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    var jsonData = JSON.parse(data);
    console.log(jsonData);
    res.json(jsonData);
  });
});

// Change variable names
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// Change variable names
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uniqid(),
    };

    readAndAppend(newNote, "db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting new note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;
  let parsedData;
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      parsedData = JSON.parse(data);
      const filterData = parsedData.filter((note) => note.id !== id);
      writeToFile("db/db.json", filterData);
    }
  });
  res.send(`Deleted note with ${req.params.id}`);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);