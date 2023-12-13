const express = require('express')
const { check, validationResult } = require('express-validator')

const router = express.Router()

const productsRepo = require('../../repositories/products')
const productsNewTemplate = require('../../views/products/new')

const {

} = require('./validators')

router.get('/admin/products', (req, res) => {
  res.send(productsNewTemplate({}))
})

router.post('/admin/products', async (req, res) => {
  const { title, price } = req.body
  const product = await productsRepo.create({ title, price })
  return res.redirect('/admin/products')
})


router.get('/admin/products/new', (req, res) => {})

module.exports = router