const jsw = require('jsonwebtoken');

module.exports = ( req, res, next ) => {
  // Autorización por el header
  const authHeader = req.get('Authorization');

  if( !authHeader ){
    const error = new Error('No autenticado, no hay JWT');
    error.statusCode = 401;
    throw error;
  }

  // Obtener token y verificarlo
  const token = authHeader.split(' ')[1];
  let revisarToken;

  try {
    revisarToken = jsw.verify( token, 'LLAVESECRETA');
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  // Sí es válido, pero hay error
  if( !revisarToken ){
    const error = new Error('No autenticado');
    error.statusCode = 401;
    throw error;
  }

  next();
}