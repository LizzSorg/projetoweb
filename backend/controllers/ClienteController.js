const Cliente = require('..models/Cliente')
const bcrypt = require('bcrypt')
const criarClienteToken = require('../helpers/cria-cliente-token')

module.exports = class ClienteController{
    static async registrar(req, res){
        const nome = req.body.nome
        const email = req.body.email
        const senha = req.body.senha
        const senhaconf = req.body.senhaconf

        if(!nome){
            res.status(422).json({mensagem: "O nome é obrigatório!"})
            return
        }
        if(!email){
            res.status(422).json({mensagem: "O email é obrigatório!"})
            return
        }
        if(!senha){
            res.status(422).json({mensagem: "A senha é obrigatória!"})
            return
        }
        if(!senhaconf){
            res.status(422).json({mensagem: "A confirmação da senha é obrigatória!"})
            return
        }

        /* Verifica se ciente já está cadastrado */
        const clienteExiste = await Cliente.findOne({email: email})

        if (clienteExiste){
            res.status(422).json({mensagem: "E-mail já cadastrado."})
            return
        }

        /* Criação de senha */
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha,salt)

        /* Adicionando o cliente ao bd */
        const cliente = new Cliente({nome, email, telefone, senha: senhaHash})
        
        try{
            const novoCliente = await cliente.save()
            await criarClienteToken(novoCliente, req, res)
        } catch(erro){
            res.status(500).json({mensagem: erro})
        }
    }   /* Fim do método registrar */
}