// init/seed.js
if (process.env.NODE_ENV !== "production") require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");
const sampleListings = require("./data");

const DB_URL =
  process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function ensureSeedUser() {
  // try to find existing user
  let user = await User.findOne({ username: "demo_user" });
  if (!user) {
    // passport-local-mongoose helper:
    user = new User({ username: "demo_user", email: "demo@example.com" });
    await User.register(user, "DemoPass123"); // password
  }
  return user;
}

async function seed() {
  await mongoose.connect(DB_URL);
  console.log("✅ DB connected for seeding");

  const owner = await ensureSeedUser();

  await Listing.deleteMany({});
  const docs = sampleListings.map((doc) => ({
    ...doc,
    owner: owner._id,
  }));
  await Listing.insertMany(docs);

  console.log(
    `🌱 Inserted ${docs.length} listings with owner ${owner.username}`
  );
  await mongoose.disconnect();
  console.log("🔌 Disconnected");
}

if (require.main === module) {
  seed().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = seed;
