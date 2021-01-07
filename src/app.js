const express = require('express');
const connectDB = require('./config/db');
const appRoutes = require('./routes/routes');
const start = require('./server');

// Create server
const app = express();

// Functions
connectDB();

// Routes
appRoutes(app);

// Server
start(app);
