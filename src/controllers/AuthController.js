const Project = require('../models/Project')
const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static async login(request, response) {
        response.render('auth/login')
    }

    static async loginPost(request, response) {
        
        const { email, password } = request.body    

        const user = await User.findOne({where : {email: email}})

        if(!user){
            request.flash('message', 'Usuário não encontrado! Insira um Usuário válido!')
            response.render('auth/login')
            return
        }
        
        const passwordMatch = bcrypt.compareSync(password, user.password)
        
        if(!passwordMatch){
            request.flash('message', 'Senha Inválida!')
            response.render('auth/login')
            return
        }

        request.session.userid = user.id 
        request.flash('message', `Seja Bem-Vindo ${user.name}` )

        request.session.save(() => {
            response.redirect('/')
        })

    }

    static async register(request, response) {
        response.render('auth/register')
    }

    static async registerPost(request, response) {

        const { name, email, password, confirmpassword } = request.body

        if(password != confirmpassword) {
            request.flash('message', 'As senhas não conferem, tente novamente!')
            response.render('auth/register')
            return
        }

        const checkIfUserExists = await User.findOne({where : {email: email}})

        if(checkIfUserExists){
            request.flash('message', 'O email já está em uso!')
            response.render('auth/register')
            return
        }

    // create password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = {
        name,
        email,
        password: hashedPassword
    }


    try {
        const createdUser = await User.create(user)

        request.session.userid = createdUser.id 
        request.flash('message', 'Cadastro realizado com sucesso')

        request.session.save(() => {
            response.redirect('/')
        })

    } catch (error) {
        console.log(error)
    }

    }

    static logout(request, response) {
        request.session.destroy()
        response.redirect('/login')   
    }
}