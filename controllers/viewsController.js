const Recipe = require('../models/recipeModel');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

//////////////////////////////////
// Get / Homepage
exports.getHome = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find({
    user: { $exists: false },
  });

  const userRecipes = await Recipe.find({
    user: { $exists: true },
    secretRecipe: { $ne: true },
  });

  if (!recipes || !userRecipes)
    return next(
      new AppError('💥Ninguna de las recetas fueron encontradas', 404),
    );

  res.status(200).render('home', { title: `Home`, recipes, userRecipes });
});

exports.getUserRecipe = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find({
    user: { $exists: true },
    secretRecipe: { $ne: true },
  });

  if (!recipes)
    return next(
      new AppError('💥Ninguna de las recetas fueron encontradas', 404),
    );

  res.status(200).render('userRecipe', { title: `receta ys`, recipes });
});

exports.getRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findOne({ slug: req.params.slug });

  if (!recipe)
    return next(
      new AppError('💥No existe ninguna receta con ese nombre.', 404),
    );

  res.status(200).render('recipe', { title: `${recipe.nombre}`, recipe });
});

exports.getSavoryRecipe = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find({ tipo: 'salada' });

  if (!recipes)
    return next(
      new AppError(
        '💥Ninguna de las 🥩Recetas Saladas fueron encontradas ',
        404,
      ),
    );

  res
    .status(200)
    .render('savoryRecipe', { title: '🥩Recetas Saladas', recipes });
});

exports.getSweetRecipe = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find({ tipo: 'dulce' });

  if (!recipes)
    return next(
      new AppError(
        '💥Ninguna de las 🧁Recetas Dulces fueron encontradas ',
        404,
      ),
    );

  res.status(200).render('sweetRecipe', { title: '🧁Recetas dulce', recipes });
});

exports.getVegetarianRecipe = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find({ tipo: 'vegetariana' });

  if (!recipes)
    return next(
      new AppError(
        '💥Ninguna de las 🥦Recetas Vegetariana fueron encontradas ',
        404,
      ),
    );

  res
    .status(200)
    .render('vegetarianRecipe', { title: '🥦Recetas Vegetariana', recipes });
});

// Buscando recetas
exports.postSearchRecipe = catchAsync(async (req, res, next) => {
  const { searchRecipe } = req.body;

  const recipes = await Recipe.find({
    $text: { $search: searchRecipe, $diacriticSensitive: true },
    secretRecipe: { $ne: true },
  });

  if (recipes.length < 1)
    return next(new AppError('🔍 ¡Ningún resultado encontrado!', 404));

  res.status(200).render('search', { title: `🔍 Buscar Receta...`, recipes });
});

// Creando Receta
exports.createRecipe = catchAsync(async (req, res, next) => {
  res.status(200).render('createRecipe', { title: `Creando Receta` });
});

exports.getMyRecipe = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find({ user: req.user.id });

  if (!recipes)
    return next(new AppError('💥 Las recetas no fueron encontradas', 404));

  res.status(200).render('myRecipes', { title: `Recetas guardadas`, recipes });
});

//////////////////////////////////
exports.getLogin = (req, res) => {
  res.status(200).render('login', { title: 'Ingrese a su cuenta' });
};

exports.getSignup = (req, res) => {
  res.status(200).render('signup', { title: 'Inscribirse' });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Tu cuenta' });
};
