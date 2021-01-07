const userRoutes = require('../auth/routes/user.routes');

const contextPath = '/mern/api/v1';

const appRoutes = (app) => {
  // Health check
  app.get('/', (req, res) => {
    res.send('[NODE] Server is running...');
  });
  // Routes
  // Security
  app.use(`${contextPath}/auth/users`, userRoutes);
};

module.exports = appRoutes;
