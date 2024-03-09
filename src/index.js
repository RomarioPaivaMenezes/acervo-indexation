const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn  = require('./db/conn')

// Models
const Project = require('./models/Project')
const User = require('./models/User')
const Baptism = require('./models/Baptism')


// Import Routes
const projectRoutes = require('./routes/ProjectsRoutes')
const authRoutes = require('./routes/AuthRoutes')
const baptismRoutes = require('./routes/BaptismsRouters')

// Import Controllers
const ProjectController = require('./controllers/ProjectController')


const path = require('path')

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

// session middleware
app.use(
    session({
        name: "session",
        secret: "our_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// flash messages
app.use(flash())

// public path 
app.use(express.static('public'))

// set session to response
app.use((request, response, next) => {

    if(request.session.userid) {
        response.locals.session = request.session
    }

    next()
})

// Routes
app.use('/projects', projectRoutes)
app.use('/', authRoutes)
app.use('/indexings', baptismRoutes)

app.get('/', ProjectController.showProjects)


conn
.sync({force: true}) // to recreate the tables
//.sync()
.then(() => {
    app.listen(3000)
}).catch((error) => console.log(err))
