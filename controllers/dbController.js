const Factures = require("../models/facture");
const Historique = require("../models/historique");
const User = require("../models/user");
const Voiture = require("../models/voiture");

const voitures = require("../seeds/voitures");
const factures = require("../seeds/facture");
const hash = require("../seeds/users");
const historiques = require("../seeds/historique");

exports.seed = async (req, res, next) => {
  const result = {};
  const users= await hash()
  try {
    await Promise.all([
      Historique.deleteMany(),
      Factures.deleteMany(),
      User.deleteMany(),
      Voiture.deleteMany(),
    ]);

    const [usersInsert, FacturesInsert, VoituresInsert, HistoriquesInsert] = await Promise.all([
      User.insertMany(users),
      Factures.insertMany(factures),
      Voiture.insertMany(voitures),
      Historique.insertMany(historiques),
    ]);

    if (VoituresInsert.length > 0) {
      result.voitures = VoituresInsert;
    }

    if (FacturesInsert.length > 0) {
      result.factures = FacturesInsert;
    }

    if (usersInsert.length > 0) {
      result.users = usersInsert;
    }

    if (HistoriquesInsert.length > 0) {
      result.historiques = HistoriquesInsert;
    }

    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};