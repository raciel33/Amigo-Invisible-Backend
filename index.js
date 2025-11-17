require('dotenv').config();
const path = require('path'); //predefindo de express

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
//const configMensaje = require('./configMensaje');

const { dbConnection } = require('./database/config');


const app = express();

app.use(cors());

app.use(express.static('public'));

app.use(express.json());

dbConnection();

//referencias al archivo de rutas
var usuario_routes = require('./routes/usuario')

//estableciendo rutas
app.use('/api', usuario_routes);

// app.post('/formulario', (req, res) => {
//     configMensaje(req.body);
//     res.status(200).send();
// })

app.use(express.static(path.join(__dirname, '/public')));

//si no es ninguna de las rutas anteriores coje el index.html
// app.get('*', (req, resp) => {
//     resp.sendFile(path.resolve(__dirname, 'public/index.html'));
// });

app.listen(3000, () => {
    console.log('‘Servidor corriendo')
});