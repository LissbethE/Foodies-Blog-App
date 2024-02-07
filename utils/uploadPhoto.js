const multer = require('multer');
const sharp = require('sharp');

const AppError = require('./AppError');
const catchAsync = require('./catchAsync');

//////////////////////////////////
// img uploads using multer

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else
    cb(
      new AppError('¡Ni una imagen! Por favor cargue solo imágenes.', 400),
      false,
    );
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = function (type) {
  return upload.single(type);
};

exports.resizePhoto = function (type) {
  return catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `${type}-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/${type}/${req.file.filename}`);

    next();
  });
};
