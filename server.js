const express = require("express");
const fs = require("fs");
const path = require("path");
// Helper method for generating unique ids
const uniqid = require("uniqid");

const PORT = 3001;
// const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("Develop/public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "Develop/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"))
);

app.get("/api/notes", function (req, res) {
  console.log('starting note read');
  fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
    // console.log(data);
    // console.log('logging data');
    var jsonData = JSON.parse(data);
    // console.log(jsonData);
    console.log('finishing note read');
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
const writeToFile = (destination, content) => {
  console.log('starting file write');
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.log(`\nData written to ${destination}`)
  );
};

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uniqid(),
    };

    readAndAppend(newNote, "Develop/db/db.json");

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
  fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      parsedData = JSON.parse(data);
      const filterData = parsedData.filter((note) => note.id !== id);
      writeToFile("Develop/db/db.json", filterData);
    }
  });
  res.send(`Deleted note with ${req.params.id}`);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

// Figure out skipping error within application and why once the skip happens I can no longer delete notes either
// Change variable names from copy and pasted functions and put those functions in the index.js and import/export as needed
// Do I need a routes folder for only 2 routes?
// Why when I changes the keys from title and text to noteTitle and noteText does my program now save notes as undefined?
// Comment and clean up code base (format)
// Finish readme (6 areas, and delete the ones I don't need)
// Add git ignore file -> why are the things im putting in gitignore not being ignored (not greyed out?)
// Figure out how to delete notes
// DEPLOY APP TO HEROKU!!!
// DEPLOY APP TO LIVE URL!!!
// Should the package.json be in the root directory of app?