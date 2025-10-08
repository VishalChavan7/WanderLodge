// server.js
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Local server running → http://localhost:${PORT}`);
});
