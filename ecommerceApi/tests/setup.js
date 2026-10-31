require("dotenv").config();
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URL);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
