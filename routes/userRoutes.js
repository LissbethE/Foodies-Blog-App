const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { uploadPhoto, resizePhoto } = require('../utils/uploadPhoto');

//////////////////////////////////
// ROUTES
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protect all routes after this middleware
//router.use(authController.protect);

// Updating user data
router.patch(
  '/updateMe',
  authController.protect,
  uploadPhoto('photo'),
  resizePhoto('users'),
  userController.updateMe,
);

// Eliminando la cuenta del usuario
router.delete('/deleteMe', authController.protect, userController.deleteMe);

module.exports = router;
