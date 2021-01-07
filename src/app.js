const express = require('express');
const connectDB = require('./config/db');
const appRoutes = require('./routes/routes');
const start = require('./server');

// Create server
const app = express();
app.use(express.json());

// Functions
connectDB();

// Routes
appRoutes(app);

// Server
start(app);
