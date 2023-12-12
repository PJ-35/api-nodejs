exports.get404 = (req, res, next) => {
  res.status(404).json({ pageTitle: 'Page introuvable !' });
};

exports.getErrors = (err, req, res, next) => {
  console.log('err', err);
  
  // Si l'erreur est de type CastError, c'est qu'on a tenté de convertir un id invalide
  if (err.kind === 'ObjectId' && err.name === 'CastError') {
    err.statusCode = 400;
    err.message= `L'id n'existe pas: ${err.message}`;
  }
  if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
    err.statusCode=400
    err.message="Courriel existant"
  }
  // Si l'erreur est de type ValidationError, c'est qu'on a tenté de créer une ressource invalide
  if (err.name === 'ValidationError') {
      err.message= `${err.message}`,
      err.statusCode = 400;
  }

  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
}