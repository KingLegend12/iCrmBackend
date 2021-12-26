const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;

//API SECURITY
app.use(helmet());
require("dotenv").config();
//hadnle cors errors
app.use(cors());

//MongoDB connection
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});
//if (process.env.NODE_ENV !== "production") {
const mDB = mongoose.connection;
mDB.on("open", () => {
  console.log("mongodb is connected");
});
mDB.on("error", (error) => {
  console.log(error);
});
//Logger

app.use(morgan("tiny"));
//}

//set body bo dyparser

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
//Loads the routers
const userRouter = require("./src/routers/user.router");
const adminRouter = require("./src/routers/admin.router");
const ticketRouter = require("./src/routers/ticket.router");
const tokensRouter = require("./src/routers/tokens.router");

//Here we use the Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokensRouter);
app.use("/v1/admin", adminRouter);
const handleError = require("./src/utils/errorhandler");

app.use((req, res, next) => {
  const error = new Error("Ressources not found");
  error.status = 404;
  next(error);
});
app.use((error, res) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(` API IS Ready ON PORT ${port}`);
});
