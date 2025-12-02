const express = require("express");
const path = require("path");

const app = express();

// Set project root directory
const ROOT = __dirname;

// Serve everything inside the root folder
app.use(express.static(ROOT));

// Always serve index.html for root route
app.get("/", (req, res) => {
    res.sendFile(path.join(ROOT, "index.html"));
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
