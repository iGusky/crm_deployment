const Clientes = require('../models/Clientes');

// Agrega un nuevo cliente
exports.nuevoCliente = async ( req, res, next ) => {
    const cliente = new Clientes( req.body );
    try {
        await cliente.save();
        res.json({
            mensaje: 'Se agregó un nuevo cliente'
        });
    } catch (error) {
        res.send(error);
        next();
    }
}
exports.mostrarClientes = async( req, res, next ) => {
    try {
        const clientes = await Clientes.find({});
        res.json( clientes );
        
    } catch (error) {
        res.send(error);
        next();
    }
}
exports.mostrarClientePorId = async ( req, res, next ) =>{
    const cliente = await Clientes.findById( req.params.id );
    if( !cliente ){
        res.json({
            mensaje: 'EL cliente no existe'
        })
        next();
    }
    res.json( cliente );
}
exports.actualiarCliente = async ( req, res, next ) => {
    try {
        const cliente = await Clientes.findOneAndUpdate( 
            { _id: req.params.id}, 
            req.body, 
            { new: true} );
        res.json( cliente );
    } catch (error) {
        res.send(error);
        next();
    }
}
exports.eliminarCliente = async ( req, res, next ) => {
    try {
        await Clientes.findOneAndDelete({ _id: req.params.id });
        res.json({ mensaje: 'Cliente eliminado' });
    } catch (error) {
        console.log( error );
        next();
    } 
}