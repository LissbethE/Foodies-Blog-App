const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

//////////////////////////////////
// App Routes

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getHome);
router.get('/recipe/:slug', viewsController.getRecipe);

router.get('/sweetRecipe', viewsController.getSweetRecipe);
router.get('/savoryRecipe', viewsController.getSavoryRecipe);
router.get('/vegetarianRecipe', viewsController.getVegetarianRecipe);

router.get('/userRecipe', viewsController.getUserRecipe);
router.post('/search', viewsController.postSearchRecipe);

router.get('/login', viewsController.getLogin);
router.get('/signup', viewsController.getSignup);

// Protect all routes after this middleware
//router.use(authController.protect);

router.get('/account', authController.protect, viewsController.getAccount);

router.get(
  '/createRecipe',
  authController.protect,
  viewsController.createRecipe,
);

router.get('/myRecipe', authController.protect, viewsController.getMyRecipe);

module.exports = router;
