const mongoose = require("mongoose");
require("dotenv").config();

const connection = async () => {
  try {
    const URI = process.env.MONGODB_URI;

    const conn = await mongoose.connect(URI);

    console.log(
      "MongoDB connected successfully:",
      conn.connection.host,
      conn.connection.name
    );

  } catch (err) {
    console.log("Failed to connect MongoDB");
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connection;