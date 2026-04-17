// Keep the exception handlers at the very top
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION — shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

import "dotenv/config"; // 1. Load environment variables FIRST

// 2. Wrap the startup in an async function to control timing
async function bootstrap() {
  try {
    // 3. Dynamically import DB and App AFTER dotenv is loaded
    const { default: connectDB } = await import("./src/config/db.js");
    const { default: app } = await import("./app.js");

    const PORT = process.env.PORT || 5000;

    // 4. Connect to DB
    await connectDB();

    // 5. Start Server
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `✅ Server running on port ${PORT} | env: ${process.env.NODE_ENV || "development"}`
      );
    });

    // Handle rejections and termination within the scope where 'server' exists
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION — shutting down...");
      console.error(err.name, err.message);
      server.close(() => process.exit(1));
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received — shutting down gracefully...");
      server.close(() => process.exit(0));
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

bootstrap();