import express from "express";
import colors from "colors";

const app = express();

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(colors.bold.green("@express:"), port);
});
