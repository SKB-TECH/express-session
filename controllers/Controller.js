const bcrypt = require('bcrypt');
// const  {users} = require('../database/utilisateur')
const cours = require('../public/cours/cours')
const { users } = require('../database/utilisateur')
const fs = require('fs')

exports.index = (req, res) => {
    res.render('index', { cours })
}

exports.PageInscription = (req, res) => {
    res.render('inscription')
}

exports.PageConnexion = (req, res) => {
    res.render('connexion')
}


exports.authentification = async (req, res) => {
    const { email, password } = req.body

    if (email && password) {
        const user = users.find((users) => users.email == email)
        if (user) {
            const verif = bcrypt.compare(password, user.password)
            if (verif) {
                req.session.iduser = user.id
                res.redirect('/')
            }
            else {
                res.redirect("/connexion")
            }
        }
        else {
            res.redirect('/connexion')
        }
    }
}

exports.register = async (req, res) => {
    const { name, email, password } = req.body
    if (email && password && name) {
        const user = users.some((users) => users.email == email)
        if (!user) {
            const salt = await bcrypt.genSalt(10)
            const vpassword = await bcrypt.hash(password, salt)

            let nusers = {
                id: users.length,
                name, email,
                password: vpassword
            }
            users.push(nusers)
            req.session.iduser = nusers.id
            res.redirect('/')
        }

        else {
            res.redirect('/inscription')
        }
    }
}

exports.deconnexion = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.render('index', { cours })
        }
        res.clearCookie(process.env.SECRETE)
        res.render('index', { cours })
    })
}

exports.lecture = (req, res) => {
    res.render("lectureVideo")
}
