const jwt = require('jsonwebtoken')
const criarClienteToken =
async(cliente, req, res) =>{
    const token = jwt.sign({
        nome: cliente.nome,
        id: cliente._id 
    }, "mysecret")

    /* Retornando o token */
    res.status(200).json({
        mensagem: "Você está autenticado!",
        token: token,
    clienteId: cliente._id})
}
module.exports = criarClienteToken