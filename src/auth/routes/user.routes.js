const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is required').trim().not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Minium password is 6 characters').trim().isLength({ min: 6 }),
  ],
  userController.createUser
);

module.exports = router;
