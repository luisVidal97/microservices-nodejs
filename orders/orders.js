const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

require("./Order");
const Order = mongoose.model("Order");

mongoose.connect(
  "mongodb+srv://lucho:lucho@cluster0-zd94r.mongodb.net/test?retryWrites=true&w=majority",
  //{ useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database is connected!");
  }
);

app.post("/order", (req, res) => {
  var newOrder = {
    CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
    BookID: mongoose.Types.ObjectId(req.body.BookID),
    initialDate: req.body.initialDate,
    deliveryDate: req.body.deliveryDate,
  };

  var order = new Order(newOrder);
  order
    .save()
    .then(() => {
      console.log("Order created with success!");
      res.send("Order created with success!");
    })
    .catch((error) => {
      if (error) throw error;
    });
});

app.get("/orders", (req, res) => {
  Order.find()
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      if (error) throw error;
    });
});

app.get("/order/:id", (req, res) => {
  Order.findById(req.params.id)
    .then((order) => {
      if (order) {
        axios
          .get("http://localhost:5555/customer/" + order.CustomerID)
          .then((response) => {
            var OrderObject = {
              customerName: response.data.name,
              bookTitle: "",
            };

            axios
              .get("http://localhost:4545/book/" + order.BookID)
              .then((response) => {
                OrderObject.bookTitle = response.data.title;
                res.json(OrderObject);
              });
          });
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      if (error) throw error;
    });
});

app.listen(7777, () => {
  console.log("Up and running - Orders service");
});
