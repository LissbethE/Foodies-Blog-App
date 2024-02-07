const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

//////////////////////////////////
const filterObj = function (obj, ...allowedFields) {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

//////////////////////////////////
exports.updateMe = catchAsync(async (req, res, next) => {
  //  Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'photo');
  if (req.file) filteredBody.photo = req.file.filename;

  //  Update user document
  await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // Send Response
  res.status(200).json({
    status: 'success',
    message: 'Los datos se actualizaron con éxito',
  });
});

// Eliminar cuenta
exports.deleteMe = catchAsync(async (req, res, next) => {
  await Promise.all([
    Recipe.deleteMany({ user: req.user.id }),
    User.findByIdAndDelete(req.user.id, { active: false }),
  ]);

  res.status(204).json({
    status: 'success',
    message: 'Tu cuenta ha sido eliminada con éxito',
  });
});
