const Productos = require('../models/Productos');

const multer = require('multer');
const shortid = require('shortid');

// Configuración de multer
const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: ( req, file, cb ) => {
            cb( null, __dirname+'../../uploads/' );
        },
        filename: ( req, file, cb ) => {
            const extension = file.mimetype.split('/')[1];
            cb( null, `${ shortid.generate() }.${ extension }` );
        }
    }),
    fileFilter( req, file, cb ) {
        if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
            cb( null, true);
        } else {
            cb( new Error('Formato no válido') )
        }
    },
}

// Pasar configuracion y el campo
const upload = multer( configuracionMulter ).single('imagen');

// Sube un archivo
exports.subirArchivo = ( req, res, next ) => {
    upload( req, res, function( error ) {
        if( error ) {
            res.json({ mensaje: error })
        }
        return next();
    } )
}

exports.nuevoProducto = async ( req, res, next ) => {
    const producto = new Productos( req.body );
    try {
        if( req.file.filename ){
            producto.imagen = req.file.filename
        }

        await producto.save();
        res.json({ mensaje: 'Se agregó un nuevo producto' });
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarProductos = async ( req, res, next ) => {
    try {
        const productos = await Productos.find({});
        res.json( productos );
    } catch (error) {
        console.log( error );
        next();
    }
}

exports.mostrarProductoPorId = async ( req, res, next ) => {
    const producto = await Productos.findById( req.params.id );

    if( !producto ){
        res.json({ mensaje: 'Ese producto no existe' });
        next();
    }
    res.json( producto );
}

exports.actualizarProducto = async ( req, res, next ) => {
    try {

        let productoAnterior = await Productos.findById( req.params.id );
        let nuevoProducto = req.body;
        if( req.file.filename ){
            nuevoProducto.imagen = req.file.filename
        } else {
            nuevoProducto.imagen = productoAnterior.imagen
        }

        let producto = await Productos.findByIdAndUpdate(
            { _id: req.params.id }, 
            nuevoProducto, 
            { new: true } );
        res.json( producto );
    } catch (error) {
        console.log( error );
        next();
    }
}

exports.eliminarProducto = async ( req, res, next) => {
    try {
        const producto = await Productos.findOneAndDelete({ _id: req.params.id });
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        console.log( error );
        next();
    }
}

exports.buscarProducto = async ( req, res, next ) => {
  try {
    
    const { query } = req.params;
    const producto = await Productos.find({ nombre: new RegExp(query, 'i')});
    res.json( producto );
  } catch (error) {
    console.error(error);
    next();
  }
}