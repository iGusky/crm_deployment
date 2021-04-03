const Pedidos = require('../models/Pedidos');

exports.nuevoPedido = async ( req, res, next ) => { 
    const pedido = new Pedidos( req.body );
    try {
        await pedido.save();
        res.json({ mensje: 'Se agrego el pedido' });
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarPedidos = async ( req, res, next ) => {
    try {
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });
        res.json( pedidos );
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarPedidoPorId = async ( req, res, next ) => {
    const pedido = await Pedidos.findById( req.params.id ).populate('cliente').populate({
        path: 'pedido.producto',
        model: 'Productos'
    });
    
    if( !pedido ){
        res.json({ mensaje: 'Pedido inexistente' })
        return next();
    }

    res.json( pedido );
}
exports.actualizarPedido = async ( req, res, next ) => {
    try {
        let pedido = await Pedidos.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.json({ pedido });
    } catch (error) {
        console.log( error )
    }
}

exports.eliminarPedido = async ( req, res, next ) => {
    try {
        await Pedidos.findOneAndDelete({ _id: req.params.id });
        res.json({ mensaje:'Pedido eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }
}