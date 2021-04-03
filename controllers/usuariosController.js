const Usuarios = require('../models/Usuarios'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async( req, res ) => {
  // Leer los datos del usuarios y colocarlos enel modelo
  const usuario = new Usuarios( req.body );
  usuario.password = await bcrypt.hash( req.body.password, 12 );
  
  // Almacenar el usuario
  try {
    await usuario.save();
    res.json({ mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    console.log(error)
    res.json({mensaje: 'Hubo un error'});
  }
}
exports.autenticarUsuario = async ( req, res, next ) => {
  // Buscar el usuario
  const usuario = await Usuarios.findOne({ email: req.body.email });
  if( !usuario ) {
    await res.status(401).json({mensaje: "Ese usuario no existe"});
    next();
  } else {
    //  Verificar el password
    if( !bcrypt.compareSync( req.body.password, usuario.password )){
      await res.status(401).json({ mensaje: "Password incorrecto" });
      next();
    } else {
      // Firmar token
      const token = jwt.sign({
        email: usuario.email,
        nombre: usuario.nombre,
        id: usuario._id
      }, 
      'LLAVESECRETA',
      {
        // Cuando expira el token
        expiresIn: '1h'
      });

      // Retornar token
      res.json({ token })
    }
  }
}