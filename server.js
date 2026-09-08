const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from your build directory
app.use(express.static(path.join(__dirname, 'dist'))); // or 'build', depends on your setup

// Handle SPA routing - send index.html for unknown routes
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
