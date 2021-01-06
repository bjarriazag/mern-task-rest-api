const express = require('express');
// Create server
const app = express();
// Environments
const PORT = process.env.PORT || 4000;

// Page
app.get('/', (req, res) => {
  res.send('[NODE] Server is running...');
});

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
