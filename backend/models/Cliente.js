const mongoose = require('../db/conecta')
const {Schema} = mongoose

const Cliente = mongoose.model('Cliente',
new Schema({
    nome: {type: String, require: true},
    email:{type: String, require: true},
    senha:{type: String, require: true},
    },
    {timestamp: true}
))

module.exports = Cliente