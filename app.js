const express = require('express')
const session = require('express-session')
const path = require('path')
require('dotenv').config({ path: ".env" })
const morgan = require('morgan')
const bcrypt = require('bcrypt');
const ejs = require('ejs')
const cours = require('./public/cours/cours')

const app = express()
const PORT = process.env.PORT
const { index, register, PageConnexion, deconnexion, PageInscription, lecture, authentification } = require('./controllers/Controller')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("common"))
app.set('view engine', 'ejs')


app.use('views', express.static(path.resolve(__dirname, 'views')))
app.use('/css', express.static(path.resolve(__dirname, './public/css')))
app.use('/cours', express.static(path.resolve(__dirname, './public/cours')))
app.use('/images', express.static(path.resolve(__dirname, './public/images')))
app.use('/js', express.static(path.resolve(__dirname, './public/js')))

app.use(session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRETE,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 2,
        secure: false
    }
})

)

const verification = (req, res, next) => {
    if (!req.session.iduser) {
        res.redirect('/connexion')
    }
    else {
        next()
    }

}
app.get('/', index)
app.get('/inscription', PageInscription)
app.get('/connexion', PageConnexion)
app.get('/deconnexion', deconnexion)
app.get('/lecture', verification, lecture)

app.post('/api/users/register', register)
app.post('/api/users/auth', authentification)


app.listen(2200, (error) => {
    if (!error) {
        console.log(`Server lance au port 2200`);
    }
})


