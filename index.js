const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const port = 3000
const path = require('path')
 
const app = express()

const conn = require('./db/conn')



//models
const Tought = require('./models/Tought.js')
const User = require('./models/User')

//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//public path
app.use('/public', express.static(path.join(__dirname,'public')))

//receber resposta do body middleware
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

//session middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), 'session'),

        }),
        cookie:{
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

//flash messages
app.use(flash())

//set session to res
app.use((req, res, next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }

    next()

})

//import Routes
    const toughtsRoutes = require('./routes/ToughtsRouters.js')

    const authRoutes = require('./routes/authRoutes.js')

//import controller
    const ThoughtController = require('./controllers/ToughtController.js')

//Routes
                                        //com quais variaveis as rotas se comunicam
    app.use('/toughts', toughtsRoutes) // const toughtsRoutes = require('./routes/ToughtsRouters')
    app.get('/', ThoughtController.showThoughts)//const ThoughtController = require('./controllers/ToughtController.js')
    
    app.use('/', authRoutes) //const authRoutes = require('./routes/authRoutes.js')


conn
    .sync()
    //.sync({force: true})
    .then(()=>{
        app.listen(port, ()=>{
            console.log('rodando')
        })
    }).catch((err)=>{
        console.log(err)
    })