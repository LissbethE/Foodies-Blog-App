const express = require('express');

const authController = require('../controllers/authController');
const recipeController = require('../controllers/recipeController');
const { uploadPhoto, resizePhoto } = require('../utils/uploadPhoto');

//////////////////////////////////
// ROUTES
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post(
  '/createRecipe',
  uploadPhoto('recipePhoto'),
  resizePhoto('recipes'),
  recipeController.createRecipe,
);

router.delete('/deleteRecipe/:id', recipeController.deleteRecipe);

module.exports = router;
