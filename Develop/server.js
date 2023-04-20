const express = require('express');
const fs = require('fs');
const path = require('path');
// Helper method for generating unique ids
const uniqid = require('uniqid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', function (req, res) {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    var jsonData = JSON.parse(data);
     console.log(jsonData);
     res.json(jsonData);
  });
});

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

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uniqid(),
    };

    readAndAppend(newNote, 'db/db.json');
    
    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting new note')
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const deleteNote = req.params.deleteNote || req.query.deleteNote;
  actions.remove(req.params.id, deleteNote, handleResults(res));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);













// GET request for reviews
app.get('/api/reviews', (req, res) => {
  res.status(200).json(reviews);
});

// POST request to add a review
// NOTE: Data persistence isn't set up yet, so this will only exist in memory until we implement it
app.post('/api/reviews', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { product, review, username } = req.body;

  // If all the required properties are present
  if (product && review && username) {
    // Variable for the object we will save
    const newReview = {
      product,
      review,
      username,
      review_id: uuid(),
    };

    const response = {
      status: 'success',
      body: newReview,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});

  // In server.js
  // Create post route (post/api/notes)
  // Add to the array json
  // Stringify array
  // Write file to db.json
  // Add git ignore file

  // Figure out how to delete notes
  // Change variable names from copy and pasted functions and put those functions in the index.js and import/export as needed
  // Do I need a routes folder for only 2 routes?
  // Why when I changes the keys from title and text to noteTitle and noteText does my program now save notes as undefined?
  // Add readme
  // Add git ignore file

