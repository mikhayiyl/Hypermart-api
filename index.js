const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const winston = require("winston");
const helmet = require("helmet");
const cors = require("cors");
const Joi = require("joi");
const config = require("config");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require('mongoose');


const auth = require("./routes/auth");
const genres = require("./routes/genres");
const categories = require("./routes/categories");
const users = require("./routes/users");
const products = require("./routes/products");
const carts = require("./routes/carts");
const payments = require("./routes/stripe");
const orders = require("./routes/orders");

const app = express();



const port = process.env.PORT || config.get("port");


if (!config.get('jwtPrivateKey')) {
  winston.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}




const db = config.get('db');
mongoose.connect(db)
  .then(() => winston.info(`Connected to ${db}...`));






app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(cors());
app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/carts", carts);
app.use("/api/orders", orders);
app.use("/api/auth", auth);
app.use("/api/payments", payments);
app.use("/api/genres", genres);
app.use("/api/categories", categories);





const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
