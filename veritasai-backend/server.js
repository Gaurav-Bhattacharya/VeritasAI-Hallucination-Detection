import "dotenv/config";
import app from "./app.js";
import connectDB from "./src/config/db.js";

// Uncaught exception (sync errors)
process.on("uncaughtException", (err) => {
  console.log("uncaughtException shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Port
const PORT = process.env.PORT || 5000;

// Connect DB and start server
let server;

connectDB().then(() => {
  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on ${PORT}`);
  });
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection shutting down...");
  console.log(err.name, err.message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
