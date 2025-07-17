const express = require("express");
const { connectToDatabase } = require("./src/config/db");
const { allRoutes } = require("./src/module/allroutes");
require("dotenv").config({ quiet: true });

const app = express();

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server health is good",
  });
});

app.use(express.json());
app.use("/api/v2", allRoutes);

app.listen(process.env.PORT, async () => {
  await connectToDatabase();
  console.log(`Server is running on port ${process.env.PORT}`);
});
