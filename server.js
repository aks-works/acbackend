const path = require("path");
const express = require("express");
const dotEnv = require("dotenv");
const connectDb = require("./config/db");
const winston = require("winston");
const morgan = require("morgan");
const cors = require("cors");

const { errorHandler } = require("./middlewares/errors");

dotEnv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

connectDb();

const app = express();
app.use(cors());

if (process.env.NODE_ENV === "development")
  app.use(morgan("combined", { stream: winston.stream.write }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", require("./routes/userRouter"));
app.use("/blog", require("./routes/blogRouter"));
app.use(express.static(path.join(__dirname, "public")));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("***********************");
  console.log(`Server started on ${PORT} && running on ${NODE_ENV} mode`);
});
