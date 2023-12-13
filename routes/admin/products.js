const express = require('express')
const { check, validationResult } = require('express-validator')

const router = express.Router()

const productsRepo = require('../../repositories/products')
const productsNewTemplate = require('../../views/products/new')

const {
  requireTitle,
  requirePrice
} = require('./validators')

router.get('/admin/products', (req, res) => {
  res.send(productsNewTemplate({}))
})

router.post('/admin/products', [requireTitle, requirePrice], async (req, res) => {
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    console.log('error!')
    // return res.send(signUpTemplate({ req, errors }))
  }
  if (errors.isEmpty()) {
  const { title, price } = req.body
  await productsRepo.create({ title, price })
  return res.redirect('/admin/products')
}})


router.get('/admin/products/new', (req, res) => {})

module.exports = router