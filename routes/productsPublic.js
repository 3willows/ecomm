const express = require('express')
const multer = require('multer')

const productsRepo = require('../repositories/products')
const productsPublicTemplate = require('../views/products/publicList')

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

const products = require('../repositories/products')

router.get('/products/public', async (req, res) => {
  const products = await productsRepo.getAll()
  res.send(productsPublicTemplate ({products}))
})

router.post('/cart/products', async (req, res) => {
  res.send("hello!")
})

module.exports = router
