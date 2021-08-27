const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const logger = require("morgan");
const studentRouter = require("./routes/student");
const teacherRouter = require("./routes/teacher");

const static_file_folder = "./myclass-client/build";

app.use(express.static(path.resolve(__dirname, static_file_folder)));

//midlleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(logger("dev"));

app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, static_file_folder, "index.html"));
});

//connecting to database
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to DB");
  }
);
const con = mongoose.connection;
// con.then(() => {
//   console.log("connected to DB");
// });

//listen to the server
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(
    `*****************   server started at ${port}  *********************************`
  );
});
