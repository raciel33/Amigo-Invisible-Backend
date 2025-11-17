const { generarJWT } = require('../helpers/jwt');
const { response } = require('express');

//importamos el modelo
const Usuario = require('../models/usuario');

//ecriptado de contraseñas
const bcrypt = require('bcryptjs');

const registroUsuario = async(req, resp = response) => {

    console.log(req.body);
    //la respuesta que viene del body
    const { email, password } = req.body;

    try {
        //busca solo este campo
        const existeEmail = await Usuario.findOne({ email });

        //instancia de usuario del modelo
        const usuario = new Usuario(req.body);

        //validacion para que el email sea unico
        if (existeEmail) {
            //respuesta a dar si existe el email
            return resp.status(400).json({
                ok: false,
                msg: "El correo ya existe"

            });
        }

        //Encriptado de contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save(); //guarda en la BD

        //generamos un token
        const token = await generarJWT(usuario.id);


        resp.json({
            ok: true,
            usuario,
            token
        });




    } catch (error) {
        console.log(error);

        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        });

    }

};




const login_usuario = async(req, res = response) => {

    const { email, password } = req.body; //extraemos el email y password
    console.log(req.body);
    try {
        //verificar email
        const usuarioBD = await Usuario.findOne({ email }); //captamos el email

        usuarioBD.seleccion = true;

        //si no existe el email
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'email no es valido'
            });
        }

        //verificar contraseña
        /*bcrypt.compareSync: compara la contraseña que escribimos con la que esta en la base de datos
        (devuelve true si coincide)
        */
        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        //
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'password no es valido'
            });
        }

        //Generar un tokens
        //generarJWT: viene de /heplpers/jw.js
        const token = await generarJWT(usuarioBD.id);

        //Si todo va bien devuelve :
        res.json({
            ok: true,
            token,
            usuarioBD

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
};


const get_session_user = async(req, resp = response) => {

    const id = req.params['id'];

    try {
        const reg = await Usuario.findById(id);
        resp.status(200).send({ data: reg });

    } catch (error) {
        resp.status(200).send({ data: undefined });

    }





};

const listarParticipantes = async(req, res = response) => {


    const id = req.uid;
    const user = await Usuario.findById(id);


    if (user) {
        const participantes = await Usuario.find();


        res.json({
            ok: true,
            participantes,
        });
    }

}


const update_seleccionado = async(req, resp = response) => {

    const id = req.params['id'];

    console.log(id);

    try {

        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return resp.status(404).json({
                ok: false,
                msg: 'No exixtse usuario con ese id'
            });
        }

        const cambiosUser = {
            ...req.body, //aqui viene toda la informacion del body
            seleccion: true
        }

        //se actualiza los campoos de las variedades
        const userUpdate = await Usuario.findByIdAndUpdate(id, cambiosUser, { new: true })



        resp.status(200).send({ data: userUpdate });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ',
            error
        })
    }

}

const update_ya_elegi = async(req, resp = response) => {

    const id = req.params['id'];

    console.log(id);

    try {

        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return resp.status(404).json({
                ok: false,
                msg: 'No exixtse usuario con ese id'
            });
        }

        const cambiosUser = {
            ...req.body, //aqui viene toda la informacion del body
            ya_elegi: true
        }

        //se actualiza los campoos de las variedades
        const userUpdate = await Usuario.findByIdAndUpdate(id, cambiosUser, { new: true })



        resp.status(200).send({ data: userUpdate });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ',
            error
        })
    }



};



module.exports = {
    registroUsuario,
    login_usuario,
    get_session_user,
    listarParticipantes,
    update_seleccionado,
    update_ya_elegi
}