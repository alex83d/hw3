const express = require('express')
const router = express.Router()
const db = require('../lib/db')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const { uploadFile, isAdmin } = require('../lib/utill')

router.get('/', isAdmin, (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  const skills = db.get('skills').value()
  res.render('pages/admin', { title: 'Admin page', skills })
})

router.post('/skills', async (req, res, next) => {
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */
  // res.send('Реализовать сохранение нового объекта со значениями блока скиллов')
  const validField = ['age', 'concerts', 'cities', 'years']
  const newSkills = req.body
  for (const name in newSkills) {
    if (
      Object.prototype.hasOwnProperty.call(newSkills, name) &&
      newSkills[name] &&
      validField.some((field) => name === field)
    ) {
      await db
        .get('skills')
        .find({ name: name })
        .assign({ number: newSkills[name] })
        .write()
    }
  }

  return res.redirect('/admin')
})

router.post('/upload', (req, res, next) => {
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  // res.send('Реализовать сохранения объекта товара на стороне сервера')

  const form = formidable()
  const upload = path.join('./public', 'upload')

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  form.uploadDir = path.join(process.cwd(), upload)

  form.parse(req, function (err, fields, files) {
    if (err) {
      next()
    }

    const valid = uploadFile(fields, files)

    if (valid.err) {
      fs.unlinkSync(files.photo.path)
      return res.redirect(`/?msg=${valid.status}`)
    }
    const fileNameForSave = files.photo.name.replace(/\s/g, '-')
    console.log(fileNameForSave)
    const fileName = path.join(upload, fileNameForSave)
    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err.message)
        return
      }
      db.get('products')
        .push({
          src: path.join('/upload', fileNameForSave),
          name: fields.name,
          price: Number(fields.price),
        })
        .write()
      res.redirect('/')
    })
  })
})

module.exports = router
