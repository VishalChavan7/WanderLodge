// app.js
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

// Load .env only in non-production (Vercel provides envs in prod)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

/* --------------------------- MongoDB Connection --------------------------- */
/**
 * Serverless-safe Mongo connection (singleton).
 * Prevents creating a new connection on each Vercel invocation.
 */
const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) {
  console.warn(
    "⚠️  ATLASDB_URL is not set. Set it in your environment variables."
  );
}

let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(dbUrl, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo connection error:", err));

/* ------------------------------ App Settings ----------------------------- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Behind Vercel proxy; enables secure cookies when NODE_ENV=production
app.set("trust proxy", 1);

/* --------------------------------- Session -------------------------------- */
const sessionStore = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600, // seconds
});

sessionStore.on("error", (err) => {
  console.error("❌ Mongo session store error:", err);
});

const sessionOptions = {
  store: sessionStore,
  secret: process.env.SECRET || "fallback-secret", // set SECRET in env
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // one week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // secure cookies in production (Vercel)
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

app.use(session(sessionOptions));
app.use(flash());

/* -------------------------------- Passport -------------------------------- */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ---------------------------- Locals for Views ---------------------------- */
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

/* --------------------------------- Routes --------------------------------- */
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.get("/health", (_req, res) => res.send("OK"));

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Redirect root URL to /listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

/* ------------------------------- 404 & Errors ----------------------------- */
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = err.message || "Something went wrong";
  res.status(statusCode).render("error.ejs", { message });
});

/* -------------------- Local Dev: start only if direct run ------------------ */
// For Vercel: we export the app (no app.listen here).
// For local dev: `node app.js` will start the server, or use `node server.js`.
if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

module.exports = app;
