const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voitureSchema = new Schema(
  {
    marque: {
      type: String,
      required:true,
      match: [/^[^\s].{0,49}$/, 'La marque doit contenir entre 1 et 50 caractères.'],
      /*validate: {
        validator: (value) => validator.isLength(value, { min: 1, max: 50 }),
        message: 'La marque doit contenir entre 1 et 50 caractères.',
      },*/
    },
    modele: {
      type: String,
      required:true,
      match: [/^[^\s].{0,49}$/, 'Le modèle doit contenir entre 1 et 50 caractères.'],
      /*validate: {
        validator: (value) => validator.isLength(value, { min: 1, max: 50 }),
        message: 'Le modèle doit contenir entre 1 et 50 caractères.',
      },*/
    },
    couleur: {
      type: String,
      required:true,
      match: [/^[^\s].{2,49}$/, 'La couleur doit contenir entre 3 et 50 caractères.'],
      /*validate: {
        validator: (value) => validator.isLength(value, { min: 3, max: 50 }),
        message: 'La couleur doit contenir entre 3 et 50 caractères.',
      },*/
    },
    plaque: {
      type: String,
      required:true,
      validate: {
        validator: (value) => value.length === 6,
        message: 'La plaque d\' immatriculation doit contenir exactement 6 caractères.',
      },
    },
    valet: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isParked: {
      type: Boolean,
    },
    isMoving: {
      type: Boolean,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    timeToLeave: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voiture', voitureSchema);
