const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/login',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Minium password is 6 characters').trim().isLength({ min: 6 }),
  ],
  authController.login
);

module.exports = router;
