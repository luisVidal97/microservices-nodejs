const mongoose = require("mongoose");

//A model: name of collection, { collection data }
mongoose.model("Book", {
  //Title, author, numerPages, publisher
  title: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  numberPages: {
    type: Number,
    require: true,
  },
  publisher: {
    type: String,
    require: true,
  },
});
