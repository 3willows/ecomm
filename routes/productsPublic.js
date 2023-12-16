const express = require('express')
const multer = require('multer')
const crypto = require('crypto')

const productsRepo = require('../repositories/products')
const cartRepo = require('../repositories/cart')
const productsPublicTemplate = require('../views/products/publicList')

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

router.get('/products/public', async (req, res) => {
  const products = await productsRepo.getAll()
  if (!req.session.id) {
  req.session.id = crypto.randomBytes(5).toString('hex')
  }
  res.send(productsPublicTemplate({ products }))
})

router.post('/cart/products/:id', async (req, res) => {
  if (!req.session.id) {
    res.redirect('/products/public')
  }
  const sessionId = req.session.id
  const productId = req.params.id
  cartRepo.create(sessionId, productId)
  res.redirect('/products/public')
})

module.exports = router
