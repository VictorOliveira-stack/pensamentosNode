const Tought = require('../models/Tought.js')
const Thought = require('../models/Tought.js')
const User = require('../models/User.js')

const {Op} = require('sequelize')


module.exports = class ThoughtController {
    static async showThoughts(req, res){

        let search = ''
        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        }else{
            order = 'DESC'
        }
        
         const toughtsData = await Tought.findAll({
            include: User,
            where:{
                title: {[Op.like]: `%${search}%`}
            },
            order: [['createdAt', order]],
        })
        

        const toughts = toughtsData.map((result) => result.get({plain: true}))

        let toughtsQty = toughts.length

        if(toughtsQty === 0){
            toughtsQty = false
        }

        


       

        res.render('toughts/home.handlebars', {toughts, search, toughtsQty})
        
    }

    static async dashboard(req, res){
            
        const userId = req.session.userid

        const user = await User.findOne({
            where:{
                id: userId,
            },
            include: Tought,//inclluindo o "include' voce poderar incluir os posts junto do id
            plain: true, //aqui permite usar o for each com awway []

        })

        //check if user exists
        if (!user){
            res.redirect('/login')
        }

       // console.log(user.Thoughts) 
        const toughts = user.Toughts.map((result) => result.dataValues)

        let emptyToughts = false

        if(toughts.length === 0){
             emptyToughts = true
        }

        res.render('toughts/dashboard', {toughts, emptyToughts})
    }


    static createTougths(req,res){
        res.render('toughts/create.handlebars')
    }

    static async createTougthsSave(req,res){

        const tought = {
            title: req.body.title,
            UserId: req.session.userid,
        }

        try {
            
            await Thought.create(tought)

            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(()=>{
             res.redirect('/toughts/dashboard')
            })

        } catch (error) {
            console.log('aconteceu um erro ao ciar o pensamento:' + error)
        }

    }

    static async removeThought(req,res){

        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Tought.destroy({where: {id:id, UserId: UserId}})
            req.flash('message', 'Pensamento removido com sucesso com sucesso!')
        
        } catch (error) {
            console.log('aconteceu um erro ao deletar:' +error)
        }

        

    }

    static async updateTougths(req,res){

        const id = req.params.id

        const tought = await Thought.findOne({where: {id:id}, raw: true})

        res.render('toughts/edit.handlebars', {tought })
    }


    static async updateTougthsSave(req,res){
        const id = req.body.id

        const tought = {
            title: req.body.title,
        }

        try {
            await Tought.update(tought, {where: {id:id}})

            req.flash('message', 'Pensamento editado com sucesso com sucesso!')

            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })

        } catch (error) {
            console.log('aconteceu um erro: ' +error)
        }
        
    }


} 