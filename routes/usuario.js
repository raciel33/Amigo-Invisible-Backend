var express = require('express');
var usuarioController = require('../controllers/usuario');
const { validarJWT } = require('../middlewares/validar-jwt');

var api = express.Router();

//Usuario
api.post('/registroUsuario', usuarioController.registroUsuario);
api.post('/login_usuario', usuarioController.login_usuario);
api.get('/get_session_user/:id', validarJWT, usuarioController.get_session_user);
api.get('/listarParticipantes/:id', validarJWT, usuarioController.listarParticipantes);
api.put('/update_seleccionado/:id', usuarioController.update_seleccionado);
//
api.put('/update_ya_elegi/:id', usuarioController.update_ya_elegi);


module.exports = api;