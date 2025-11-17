'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    seleccion: {
        type: Boolean,
        default: false,
        required: false

    },
    ya_elegi: {
        type: Boolean,
        default: false,
        required: false

    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }

}, { collection: 'Usuario' }); //aqui podemos definir el nombre de la colection


UsuarioSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('usuario', UsuarioSchema);