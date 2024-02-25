import express from "express";

const app = express();

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(colors.bold.green("@express:"), port);
});
