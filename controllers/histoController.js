const Histo = require('../models/historique');
const Facture = require('../models/facture');

exports.getHistorique = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const histo = await Histo
    .find({ userId: userId })
    .sort({ createdAt: -1 });
    if (!histo) {
      const error = new Error('Aucun historique trouvé.');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      histo: histo
    });
  } catch (err) {
    next(err);
  }
}

exports.effectuerPaiement = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const histo = await Histo
    .find({ userId: userId, isPaid: false });
    if (!histo) {
      const error = new Error('Aucun facture à payer');
      error.statusCode = 404;
      throw error;
    }
    let montantAPaye=0
    histo.forEach(function (historique) {
      montantAPaye+=historique.price
      //historique.isPaid=true
      //await Histo.findByIdAndUpdate(historique.id, historique, { new: true });
    });
    await Histo.updateMany(
      { userId: userId, isPaid: false },
      { $set: { isPaid: true } } 
    );
        // Crée une nouvelle facture
        const facture = new Facture({
          userId:userId,
          price:montantAPaye
        });

        const result = await facture.save();

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

exports.getFacture = async (req, res, next) => {
  const userId = req.user.id;
  try{
    const facture = await Facture.find({userId:userId}).sort({ createdAt: -1 })
    if (!facture) {
      const error = new Error('Aucune facture trouvé.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(facture)
  }
  catch(err){
    next(err)
  }

}

