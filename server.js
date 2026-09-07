const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.json({
        message: "VIS Boilerplate Backend is running successfully"
,    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})