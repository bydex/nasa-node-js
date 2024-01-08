const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function mongoDisconnect() {
  return new Promise((resolve) => {
    setTimeout(async () => {
      await mongoose.disconnect();
      resolve(true);
    }, 200);
  });
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
