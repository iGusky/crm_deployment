const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');
const usuariosController = require('../controllers/usuariosController');

// Middleware para proteger rutas, se coloca el middleare antes del controller.
const auth = require('../middleware/auth');

module.exports = function() {
    // Metodos para clientes
    router.post('/clientes', auth, clienteController.nuevoCliente);
    router.get('/clientes', auth, clienteController.mostrarClientes);
    router.get('/clientes/:id', auth, clienteController.mostrarClientePorId);
    router.put('/clientes/:id', auth, clienteController.actualiarCliente);
    router.delete('/clientes/:id', auth, clienteController.eliminarCliente);

    // Metodos para productos
    router.post('/productos', auth, productosController.subirArchivo, productosController.nuevoProducto);
    router.get('/productos', auth, productosController.mostrarProductos);
    router.get('/productos/:id', auth, productosController.mostrarProductoPorId);
    router.put('/productos/:id', auth, productosController.subirArchivo,productosController.actualizarProducto);
    router.delete('/productos/:id', auth, productosController.eliminarProducto);

    // Metodos para pedidos
    router.post('/pedidos/nuevo/:id', auth, pedidosController.nuevoPedido);
    router.get('/pedidos', auth, pedidosController.mostrarPedidos);
    router.get('/pedidos/:id', auth, pedidosController.mostrarPedidoPorId);
    router.put('/pedidos/:id', auth, pedidosController.actualizarPedido);
    router.delete('/pedidos/:id', auth, pedidosController.eliminarPedido);

    //Busqueda de productos
    router.post('/productos/busqueda/:query', productosController.buscarProducto);


    // Usuarios
    router.post('/crear-cuenta',usuariosController.registrarUsuario );
    router.post('/iniciar-sesion', usuariosController.autenticarUsuario );
    return router;
}