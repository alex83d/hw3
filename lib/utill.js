const db = require('../lib/db')
const uploadFile = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'No image', err: true }
  }
  if (!fields.name) {
    return { status: 'No name', err: true }
  }
  if (!fields.price) {
    return { status: 'No price', err: true }
  }
  return { status: 'OK', err: false }
}

const isAdmin = (req, res, next) => {
  console.log(req.session)
  if (req.session.isAdmin) {
    return next()
  }
  res.redirect('/login')
}

function getMainData() {
  const products = db.get('products').value()
  const skills = db.get('skills').value()
  return {
    products,
    skills,
  }
}

module.exports = { isAdmin, uploadFile, getMainData }
