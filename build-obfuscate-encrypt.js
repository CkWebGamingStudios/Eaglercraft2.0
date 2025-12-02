// build-obfuscate-encrypt.js
import fs from "fs";
import path from "path";
import child from "child_process";
import JavaScriptObfuscator from "javascript-obfuscator";
import crypto from "crypto";

const MODE = process.argv[2] || "build"; // obfuscate | encrypt
const SRC_DIR = path.resolve("src");
const BUILD_DIR = path.resolve("build");
const DIST_DIR = path.resolve("dist");
const ENTRY_JS = path.join(SRC_DIR, "app.js");
const OUT_JS = path.join(BUILD_DIR, "app.obf.js");
const OUT_ENC = path.join(DIST_DIR, "app.js.enc");
const META_JSON = path.join(DIST_DIR, "app.js.meta.json");

// helper
function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

// Step 1: Make a simple bundle (for small projects we'll just copy app.js to build)
function bundle() {
  ensureDir(BUILD_DIR);
  // For simplicity: copy the entry file into build (if you use bundler, replace this)
  const content = fs.readFileSync(ENTRY_JS, "utf8");
  fs.writeFileSync(path.join(BUILD_DIR, "app.bundle.js"), content, "utf8");
  console.log("[build] bundle created:", path.join(BUILD_DIR, "app.bundle.js"));
}

// Step 2: Obfuscate
function obfuscate() {
  ensureDir(BUILD_DIR);
  bundle();
  const bundlePath = path.join(BUILD_DIR, "app.bundle.js");
  const code = fs.readFileSync(bundlePath, "utf8");
  const configPath = path.resolve("obfuscator-config.json");
  const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, "utf8")) : {};
  const obf = JavaScriptObfuscator.obfuscate(code, config).getObfuscatedCode();
  ensureDir(DIST_DIR);
  fs.writeFileSync(OUT_JS, obf, "utf8");
  console.log("[build] obfuscated file written:", OUT_JS);
}

// Step 3: Encrypt obfuscated file (AES-256-GCM)
function encrypt() {
  ensureDir(DIST_DIR);
  const keyHex = process.env.FRONTEND_ENCRYPTION_KEY;
  if (!keyHex) {
    console.error("Missing FRONTEND_ENCRYPTION_KEY env var. Create one (32 bytes hex). Example: $(node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")");
    process.exit(1);
  }
  const key = Buffer.from(keyHex, "hex");
  const obfPath = OUT_JS;
  if (!fs.existsSync(obfPath)) {
    console.error("Obfuscated file not found. Run obfuscate step first.");
    process.exit(1);
  }
  const plaintext = fs.readFileSync(obfPath);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // write encrypted file
  ensureDir(DIST_DIR);
  fs.writeFileSync(OUT_ENC, encrypted);
  const meta = {
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    encFile: path.basename(OUT_ENC)
  };
  fs.writeFileSync(META_JSON, JSON.stringify(meta));
  console.log("[build] encrypted bundle written:", OUT_ENC);
  console.log("[build] meta written:", META_JSON);
}

if (MODE === "obfuscate") {
  obfuscate();
} else if (MODE === "encrypt") {
  encrypt();
} else if (MODE === "build") {
  obfuscate();
  encrypt();
} else {
  console.error("Unknown mode:", MODE);
  console.log("Usage: node build-obfuscate-encrypt.js [obfuscate|encrypt|build]");
  process.exit(1);
}
