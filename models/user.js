const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true,"Courriel requis"],
      unique: true,
      match: [/.+@.+\..+/, 'Adresse courriel invalide'],
      maxlength: [50, 'L\'adresse courriel doit contenir au plus 50 caractères']
    },
    username: {
      type: String,
      required: [true,"nom d'utilisateur requis"],
      match: [/^[^\s].{2,49}$/, 'La longueur du nom doit être entre 3 et 50 caractères.'],
      /*validate: {
        validator: (value) => /^[^\s].{2,49}$/.test(value),
        message: 'La longueur du nom doit être entre 3 et 50 caractères.',
      },+*/
    },
    password: {
      type: String,
      required: [true,"mot de passe requis"],
      minlength: [6,"Le mot de passe doit contenir un minimum de 6 caractères"]
    },
    isValet: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0
    },
    voiture: {
      type: Schema.Types.ObjectId,
      ref: 'Voiture'
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);
