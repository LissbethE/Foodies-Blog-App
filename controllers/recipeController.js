const Recipe = require('../models/recipeModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

//////////////////////////////////

exports.createRecipe = catchAsync(async (req, res, next) => {
  const data = req.body;
  data.ingredientes = req.body.ingredientes.split(',');

  if (req.file) data.recipePhoto = req.file.filename;

  // Real datos
  const newRecipe = await Recipe.create(data);

  if (!newRecipe)
    return next(new AppError('💥¡Los datos enviados no son válidos!', 404));

  // Send Response
  res.status(201).json({
    status: 'success',
    message: 'Receta Creada!',
  });

  // res.status(201).redirect('/myRecipe');
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);

  if (!recipe)
    return next(new AppError('🙅 No doc found with that ID 💥', 404));

  // Send Response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
