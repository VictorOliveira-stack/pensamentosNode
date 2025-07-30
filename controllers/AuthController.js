const User = require('../models/User')

const bcrypt = require('bcryptjs')


module.exports = class AuthController {

    static login(req,res){
        res.render('auth/login')
    }

    static async loginPost(req,res){

        const {email, senha} = req.body

        //find user
        const user = await User.findOne({where: {email: email}})
        
        if(!user){
            req.flash('message', 'Usuario ou senha invalidos!')
            res.render('auth/login.handlebars')
            return
        }
        //check if password macht
        const senhaMacth = bcrypt.compareSync(senha, user.senha )
        
        if(!senhaMacth){
            req.flash('message', 'Usuario ou senha invalidos!')
            res.render('auth/login.handlebars')
            return
        }
        //initialize session
                req.session.userid = user.id

                req.flash('message', 'Autenticação realizado com sucesso!')

                req.session.save(()=>{
                     res.redirect('/')
                })
    
    }

    static register(req,res){
        res.render('auth/register')
    }

    static async registerPost(req,res){
        const {name, email, senha, confirmpassword} = req.body

        //passawor match validation
        if(senha != confirmpassword){
            //message 
            req.flash('message', 'As senhas nao conferem, tente novamente!')
            res.render('auth/register.handlebars')
            return
        }
        //check if user exists
        const checkIfUserExists = await User.findOne({where:{email:email}})
    
            if(checkIfUserExists){
                req.flash('message', 'O e-mail ja esta em uso!')
                res.render('auth/register.handlebars')
                return
            }
            //create password

            const salt = bcrypt.genSaltSync(10) //adiciona um salt
            const hashedSenha = bcrypt.hashSync(senha, salt) //senha e salt foiram passadas aqui para criptografia

            const user = {
                name,
                email,
                senha: hashedSenha
            }

            try {
                const createdUser = await User.create(user)

                //initialize session
                req.session.userid = createdUser.id

                req.flash('message', 'Cadastro realizado com sucesso!')

                req.session.save(()=>{
                     res.redirect('/')
                })
               

            } catch (err) {
                console.log(err)
            }
            

    }

    static logout(req,res){
        req.session.destroy()
        res.redirect('/login')
    }

    


}

//estar se ccomunicando com authRoutes.js