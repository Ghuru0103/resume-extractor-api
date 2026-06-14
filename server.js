const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");

const app = express();

const upload = multer({
    storage: multer.memoryStorage()
});

app.get("/", (req, res) => {
    res.send("Resume Extractor Running");
});

app.post("/extract", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: "No file uploaded"
        });
    }
    if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({
        success: false,
        error: "Only PDF files are supported"
    });
}
    try {
        const result = await pdf(req.file.buffer);

        res.json({
            success: true,
            text: result.text
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});