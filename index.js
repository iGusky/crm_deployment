const express = require('express');
const routes  = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({ path: 'variables.env'});

// CORS para que se un cliente pueda acceder al servidor
const cors = require('cors');

// Conectar a mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});

//Crear servidor
const app = express();

// Habilitar body parser
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

// Definir dominios para recibir peticiones en whitelist
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    console.log( origin )
    // Revisar si la petición viene de un servidor en white list
    const existe = whiteList.some( dominio => dominio === origin );
    if( existe ) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}
// Habilitar CORS
app.use( cors(corsOptions) );

//Rutas de la app
app.use( '/', routes());

//Carpeta pública
app.use(express.static('uploads'));

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 4000

//puerto
app.listen(port, host = () => {
  console.log('El servidor está funcionando')
});