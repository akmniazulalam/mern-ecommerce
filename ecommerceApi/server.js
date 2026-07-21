require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
require('dotenv').config()
const { validateEnv } = require('./src/common/config/env');
validateEnv()
const app = require('./src/app');
const db = require('./src/common/config/db');
// const port = process.env.PORT || 3000;

db()

app.listen(3000, () => {
  console.log(`Server Running on port ${3000}`);
});
