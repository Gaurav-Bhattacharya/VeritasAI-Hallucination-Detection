// NOTE: In ESM, import statements are hoisted and evaluated before any
// top-level code runs. This means the uncaughtException handler below
// will NOT catch errors thrown during module loading (e.g. syntax errors
// in imported files). This is expected ESM behavior.
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION — shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

import "dotenv/config";
import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

let server;

connectDB().then(() => {
  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Server running on port ${PORT} | env: ${process.env.NODE_ENV || "development"}`,
    );
  });
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION — shutting down...");
  console.error(err.name, err.message);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Graceful shutdown on SIGTERM (e.g. from Docker, Heroku, Railway)
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully...");
  if (server) {
    server.close(() => process.exit(0));
  }
});
