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







// const readJson = (content, file) => {
//   fs.readFile(file, "utf8", (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const parsedData = JSON.parse(data);
//       parsedData.push(content);
//     }
//   });
// };

// const data = JSON;


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


// app.delete('/api/notes/:id', (req, res) => {
//   res.send(`Deleted note with ${req.params.id}`);
// });
//   // readJson(content, 'db/db.json');
//   // readAndAppend(JSON, "db/db.json");
//     fs.readFile('db/db.json', "utf8", (err, data) => {
//       if (err) {
//         console.error(err);
//       } 
//     })
      // else {
      //   const parsedData = JSON.parse(data);
      //   let newParsedData = parsedData.filter((note) => note.id !== req.params.id)
      //   console.log(newParsedData);
        
        // console.log(parsedData)
        // for(let i = 0; i < parsedData.length; i++) {
        //   if(parsedData[i].id === req.params.id) {
        //     console.log(parsedData[i].id);
        //     parsedData.splice(i, 1);
        //     console.log(parsedData);
        //     writeToFile('db/db.json', parsedData);

        //     // fs.writeFile('db/db.json', newParsedData, (err) => 
        //     //   err? console.log(err): console.log('success')
        //     // )
        //   }
        // }
      // });
    // });
// });

// const jsonData = JSON.parse();

// app.param('id', (req, res, next, id) => {
//   console.log(id)
  // req.jsonData = jsonData[id];
//   next()
// })

// app.delete('/api/notes/:id', (req, res) => {
//   const deleteNote = req.params.deleteNote || req.query.deleteNote;
//   actions.remove(req.params.id, deleteNote, handleResults(res));
// });

// app.delete('/api/notes/:id', async (req, res, next) => {
//   try {
//     req.log.debug(req.params);
//     req.log.debug(req.headers);
//   } catch (e) {
//     req.log.error(e);
//     next(e);
//   }
// });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


















// // GET request for reviews
// app.get('/api/reviews', (req, res) => {
//   res.status(200).json(reviews);
// });

// // POST request to add a review
// // NOTE: Data persistence isn't set up yet, so this will only exist in memory until we implement it
// app.post('/api/reviews', (req, res) => {
//   // Log that a POST request was received
//   console.info(`${req.method} request received to add a review`);

//   // Destructuring assignment for the items in req.body
//   const { product, review, username } = req.body;

//   // If all the required properties are present
//   if (product && review && username) {
//     // Variable for the object we will save
//     const newReview = {
//       product,
//       review,
//       username,
//       review_id: uuid(),
//     };

//     const response = {
//       status: 'success',
//       body: newReview,
//     };

//     console.log(response);
//     res.status(201).json(response);
//   } else {
//     res.status(500).json('Error in posting review');
//   }
// });

  // In server.js
  // Create post route (post/api/notes)
  // Add to the array json
  // Stringify array
  // Write file to db.json

  // Figure out skipping error within application and why once the skip happens I can no longer delete notes either
  // Change variable names from copy and pasted functions and put those functions in the index.js and import/export as needed
  // Do I need a routes folder for only 2 routes?
  // Why when I changes the keys from title and text to noteTitle and noteText does my program now save notes as undefined?
  // Comment and clean up code base
  // Finish readme (6 areas, and delete the ones I don't need)
  // Add git ignore file
  // Figure out how to delete notes

