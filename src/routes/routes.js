const userRoutes = require('../auth/routes/user.routes');
const authRoutes = require('../auth/routes/auth.routes');
// Administration
const projectRoutes = require('../modules/administration/routes/project.routes');
const taskRoutes = require('../modules/administration/routes/task.routes');

const contextPath = '/mern/api/v1';

const appRoutes = (app) => {
  // Health check
  app.get('/', (req, res) => {
    res.send('[NODE] MERN-Server is running...');
  });
  // Routes
  // Security
  app.use(`${contextPath}/security/users`, userRoutes);
  app.use(`${contextPath}/auth`, authRoutes);
  // Administration
  app.use(`${contextPath}/projects`, projectRoutes);
  app.use(`${contextPath}/tasks`, taskRoutes);
};

module.exports = appRoutes;
