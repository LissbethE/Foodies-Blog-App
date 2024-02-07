const mongoose = require('mongoose');
const slugify = require('slugify');

const recipeSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Una receta debe tener un nombre.'],
      trim: true,
      index: true,
    },

    slug: String,

    recipePhoto: {
      type: String,
      required: [true, 'Una receta debe tener una imagen de portada.'],
    },

    tipo: {
      type: String,
      required: [true, 'Una receta debe tener un tipo.'],

      enum: {
        values: ['salada', 'vegetariana', 'dulce'],
        message: 'El tipo de receta es cualquiera: salada, vegetariana y dulce',
      },

      index: true,
    },

    dificultad: {
      type: String,
      required: [true, 'Una receta debe tener una dificultad.'],

      enum: {
        values: ['fácil', 'media', 'difícil'],
        message: 'La dificultad es cualquiera: fácil, media y difícil',
      },
    },

    comensales: {
      type: Number,
      required: [true, 'Una receta debe tenerla cantidad de comensales'],
    },

    plato: {
      type: String,

      enum: {
        values: ['Entrada', 'Plato principal', 'Postre'],
      },
    },

    duracion: {
      type: Number,
      required: [true, 'Una receta debe tener el tiempo de preparacion.'],
    },

    costo: {
      type: String,
      required: [true, 'una receta debe tener un costo'],

      enum: {
        values: ['barato', 'medio', 'caro'],
        message: 'El coste es cualquiera: barato, medio y caro',
      },
    },

    resumen: {
      type: String,
      trim: true,
    },

    ingredientes: {
      type: [String],
      required: [true, 'Una receta debe tener los ingredientes'],
    },

    preparacion: {
      type: String,
      trim: true,
      required: [true, 'Una receta debe que tener un modo de preparación'],
    },

    secretRecipe: {
      type: Boolean,
      default: false,
    },

    // Modelling Reviews: Parent Referencing
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Una receta le debe pertenecer a un usuario'],
    },
  },
  {
    strictQuery: 'throw',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

////////////////////////////////
recipeSchema.pre('save', function (next) {
  this.slug = slugify(this.nombre, { lower: true });

  next();
});

// QUERY MIDDLEWARE
recipeSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo _id' });

  next();
});

/*
// poner privada receras antes de guardarlo
recipeSchema.pre(/^find/, function (next) {
  this.find({ secretRecipe: { $ne: true } });

  next();
});
*/

recipeSchema.index({ user: 1 }, { unique: true });
recipeSchema.index({ nombre: 'text', tipo: 'text' });

////////////////////////////////
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
