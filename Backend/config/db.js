const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

let memoryServer = null;
let persistentMongod = null;

// Directory where the mongod binary is cached (same default location that
// mongodb-memory-server uses, so one download serves both modes).
const BINARY_DIR = path.join(
  __dirname,
  "..",
  "node_modules",
  ".cache",
  "mongodb-memory-server"
);

// Directory that keeps database files across restarts.
const DB_DATA_DIR = path.join(__dirname, "..", "data");

// MongoDB publishes no Windows ARM64 builds, so on ARM Windows hosts force the
// x86_64 binary (runs fine under Windows x64 emulation) and pin a version that
// exists for x86_64.
const IS_WIN_ARM64 = process.platform === "win32" && process.arch === "arm64";
const BINARY_CONFIG = IS_WIN_ARM64
  ? { binary: { arch: "x86_64", version: "8.0.5" } }
  : {};

const isPortOpen = (port) =>
  new Promise((resolve) => {
    const net = require("net");
    const sock = net.connect({ host: "127.0.0.1", port });
    sock.once("connect", () => {
      sock.destroy();
      resolve(true); // something is listening
    });
    sock.once("error", () => resolve(false)); // nothing there
  });

const waitForPort = (port, maxAttempts = 30) =>
  new Promise((resolve, reject) => {
    const net = require("net");
    let attempts = 0;
    const probe = () => {
      const sock = net.connect({ host: "127.0.0.1", port });
      sock.once("connect", () => {
        sock.destroy();
        resolve(true);
      });
      sock.once("error", () => {
        if (++attempts > maxAttempts) {
          sock.destroy();
          reject(new Error("mongod did not become ready in time"));
          return;
        }
        setTimeout(probe, 500);
      });
    };
    probe();
  });

/**
 * Start a real, on-disk mongod on 127.0.0.1:27017 using the binary that
 * mongodb-memory-server downloaded. Data persists across restarts.
 */
const startPersistentMongod = async () => {
  // If something (external mongod or an earlier spawn) is already listening,
  // just reuse it.
  if (await isPortOpen(27017)) return;

  const { MongoBinary } = require("mongodb-memory-server-core");
  const binaryPath = await MongoBinary.getPath({
    downloadDir: BINARY_DIR,
    ...(BINARY_CONFIG.binary || {}),
  });

  fs.mkdirSync(DB_DATA_DIR, { recursive: true });

  persistentMongod = spawn(
    binaryPath,
    ["--dbpath", DB_DATA_DIR, "--port", "27017", "--bind_ip", "127.0.0.1"],
    { stdio: "ignore", windowsHide: true }
  );

  persistentMongod.once("error", (err) => {
    console.warn("Persistent mongod process error:", err.message);
  });

  await waitForPort(27017);
  console.log("Persistent MongoDB started at 127.0.0.1:27017");
  console.log("Data directory:", DB_DATA_DIR);
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Karya";

  // First, try the configured URI (local or Atlas)
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("MongoDB Connected Successfully to:", uri.replace(/\/\/.*@/, "//<credentials>@"));
    return;
  } catch (error) {
    console.warn("MongoDB primary connection failed:", error.message);
    console.log("Attempting to start persistent local MongoDB...");
  }

  // Next: start a persistent local mongod (data survives restarts)
  try {
    await startPersistentMongod();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("MongoDB Connected Successfully to:", uri.replace(/\/\/.*@/, "//<credentials>@"));
    return;
  } catch (error) {
    console.warn("Persistent MongoDB fallback failed:", error.message);
    console.log("Falling back to in-memory MongoDB...");
  }

  // Last resort: ephemeral in-memory MongoDB
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");

    memoryServer = await MongoMemoryServer.create(BINARY_CONFIG);
    const memUri = memoryServer.getUri();

    await mongoose.connect(memUri);
    console.log("MongoDB In-Memory Server started and connected at:", memUri);
    console.log("Note: Data is ephemeral and will be lost on restart.");
  } catch (memError) {
    console.warn("In-memory MongoDB also failed:", memError.message);
    console.warn("Backend will continue running in offline/graceful fallback mode.");
  }
};

// Cleanly stop the spawned mongod when the app shuts down
process.on("exit", () => {
  if (persistentMongod) {
    try {
      persistentMongod.kill();
    } catch (_) {
      /* noop */
    }
  }
});

module.exports = connectDB;