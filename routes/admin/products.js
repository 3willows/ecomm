const express = require('express')
const { check, validationResult } = require('express-validator')

const router = express.Router()

const productsRepo = require('../../repositories/products')
const productsNewTemplate = require('../../views/products/new')


router.get('/admin/products', (req, res) => {
  res.send(productsNewTemplate({}))
})

router.post('/admin/products', (req, res) => {
  res.send("hello!")
})


router.get('/admin/products/new', (req, res) => {})

module.exports = router
