const express = require('express')
const router = express.Router()
// const { products, skills } = require('../data.json')
const nodemailer = require('nodemailer')
const config = require('../lib/config.json')
const { getMainData } = require('../lib/utill')

router.get('/', (req, res, next) => {
  const { products, skills } = getMainData()
  return res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функционал отправки письма.
  if (!req.body.name || !req.body.email || !req.body.message) {
    const { products, skills } = getMainData()
    return res.render('pages/index', {
      title: 'Main page',
      products,
      skills,
      msgemail: 'Все поля нужно заполнить!',
    })
  }
  const transporter = nodemailer.createTransport(config.mail.smtp)
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`,
  }

  transporter.sendMail(mailOptions, function (err, info) {
    const { products, skills } = getMainData()
    /* try { 
      return res.redirect('/?=sent mail successfully');
    } catch (err) {
     return res.redirect('/');
    }  
    */

    if (err) {
      return res.render('pages/index', {
        title: 'Main page',
        products,
        skills,
        msgemail: `При отправке письма произошла ошибка!: ${err}`,
      })
    }
    return res.render('pages/index', {
      title: 'Main page',
      products,
      skills,
      msgemail: `Сообщение успешно отправлено!: ${info}`,
    })
  })
})

module.exports = router
