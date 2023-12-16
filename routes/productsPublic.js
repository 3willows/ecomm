const express = require('express')
const multer = require('multer')
const crypto = require('crypto')

const productsRepo = require('../repositories/products')
const productsPublicTemplate = require('../views/products/publicList')

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

router.get('/products/public', async (req, res) => {
  const products = await productsRepo.getAll()
  req.session.id = crypto.randomBytes(5).toString('hex');
  res.send(productsPublicTemplate ({products}))
})

router.post('/cart/products/:id', async (req, res) => {
  const id = req.params.id
  const sessionId = req.session.id
  
  res.send(id)
})

module.exports = router
