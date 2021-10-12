const express = require('express')
const db = require('../lib/db')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  const { email, password } = req.body

  if (!email && !password) {
    res.render('pages/login', { title: 'SigIn page' })
    next()
  }

  const user = db.get('users').find({ email, password }).value()
  if (!user) {
    res.render('pages/login', {
      title: 'SigIn page',
      msglogin: 'check the fields',
    })
  } else {
    console.log(req.session)
    req.session.isAdmin = true
    res.redirect('/admin')
  }

  // TODO: Реализовать функцию входа в админ панель по email и паролю
  // res.send('Реализовать функцию входа по email и паролю')
})

module.exports = router
