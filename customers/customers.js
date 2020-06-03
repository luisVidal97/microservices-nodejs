const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

require("./Customer");
const Customer = mongoose.model("Customer");

mongoose.connect(
  "mongodb+srv://lucho:lucho@cluster0-zd94r.mongodb.net/test?retryWrites=true&w=majority",
  //{ useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database is connected!");
  }
);

app.post("/customer", (req, res) => {
  var newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  var customer = new Customer(newCustomer);

  customer
    .save()
    .then(() => {
      res.send("Customer created with success!");
    })
    .catch((error) => {
      if (error) throw error;
    });
});

app.get("/customers", (req, res) => {
  Customer.find()
    .then((customers) => {
      res.json(customers);
    })
    .catch((error) => {
      if (error) throw error;
    });
});

app.get("/customer/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      if (customer) {
        res.json(customer);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      if (error) throw error;
    });
});

app.delete("/customer/:id", (req, res) => {
  Customer.findOneAndDelete(req.body.id)
    .then(() => {
      res.send("customer deleted with success!");
    })
    .catch((error) => {
      throw error;
    });
});

app.listen("5555", () => {
  console.log("Up and running - Customer service");
});
