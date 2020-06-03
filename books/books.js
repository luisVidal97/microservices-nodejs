//Load express
const express = require("express");
const app = express();

// is a methd to recieve data from request
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Load mongoose: is a module that allow connecting to my application with databse
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

require("./Book");
const Book = mongoose.model("Book");

mongoose.connect(
  "mongodb+srv://lucho:lucho@cluster0-zd94r.mongodb.net/test?retryWrites=true&w=majority",
  //{ useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database is connected!");
  }
);

// A simple express route
app.get("/", (req, res) => {
  res.send("This is book services!");
});

//create functionolity
app.post("/book", (req, res) => {
  console.log(req.body);

  var newBook = {
    title: req.body.title,
    author: req.body.author,
    numberPages: req.body.numberPages,
    publisher: req.body.publisher,
  };

  //create a new book
  var book = new Book(newBook);

  book
    .save()
    .then(() => {
      console.log("New book created!");
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });

  res.send("A new book created  with success!");
});

app.get("/books", (req, res) => {
  Book.find()
    .then((books) => {
      console.log(books);
      res.json(books);
    })
    .catch((error) => {
      throw error;
    });
});

app.get("/book/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      res.sendStatus(404);
      throw error;
    });
});

app.delete("/book/:id", (req, res) => {
  Book.findOneAndDelete(req.params.id)
    .then(() => {
      res.send("Book deleted with success!");
    })
    .catch((error) => {
      if (error) throw error;
    });
});

// open express server:
//     first is the port and then is the callback function when your server is up
// For execution this app, running 'node books.js' or nodemon books.js
app.listen(4545, () => {
  console.log("Up and running! -- This is our Books service");
});

//-----------------------------------------------------------------
//To run this services, use node books.js o nodemon books.js
//-----------------------------------------------------------------
