const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '😁 Please tell us your name'],
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  photo: { type: String, default: 'default.jpg' },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, '💥 Please provide a valid email!'],
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on Create and Save
      validator: function (el) {
        return el === this.password;
      },

      message: '💥 Passwords are not same!',
    },
  },

  passwordChangedAt: {
    type: Date,
  },

  passwordResetToken: { type: String },

  passwordResetExpires: {
    type: Date,
  },

  active: { type: Boolean, default: true, select: false },
});

//////////////////////////////////
userSchema.pre('save', async function (next) {
  // This === current doc
  if (!this.isModified(' password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

//////////////////////////////////
//* INSTANCED METHOD. it is available on all user documents

// Comparando constraseña
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if user changed password after the token was issued
userSchema.methods.changesdPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// 2) Generate the random reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

//////////////////////////////////
const User = mongoose.model('User', userSchema);

module.exports = User;
