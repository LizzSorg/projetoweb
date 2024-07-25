/* Importando model para mongodb do cliente  */
const Cliente = require('..models/Cliente')
/* Importando módulos necessários do node */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Importando helpers
const criarClienteToken = require('../helpers/cria-cliente-token')
const getToken = require('../helpers/get-token')

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

    /* Método Login */
    static async login (req,res){
        const {email, senha} = req.body
        if(!email){
        res.status(422).json({
            mensagem: "O e-mail é obrigatório"})
            return
    }
    if(!senha){
        res.status(422).json({
            mensagem: "A senha é obrigatória"})
            return
    }
    const cliente = await Cliente.findOne({email: email})

    if(!cliente){
        res.status(422).json({mensagem: "Cliente não registrado!"})
    }
    /* Verifica se senha confere */
    const verificaSenha = 
    await bcrypt.compare(senha,cliente.senha)
    if (!verificaSenha){
        res.status(422).json({mensagem: "Senha não confere!"})
        return
    }
    await createUserToken(cliente,req,res)
}
    /* Método função para verificar usuário 25/07*/

    static async verificaUsuario(req, res){
        let usuarioAtual

        console.log(req.headers.autorizacao)

        if (req.headers.autorizacao){
        const token = getToken(req)
        const decodificado = jwt.verify(token,'mysecret')
        usuarioAtual = await Cliente.findById(decodificado.id)
        currentUser.senha = undefined 
        /* segurança aqui: esvazia o retorno da senha */
    } else{
        usuarioAtual = null
    }

        res.status(200).send(usuarioAtual)
    }
}/* Fim da classe ClienteController */
