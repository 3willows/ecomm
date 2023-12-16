const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const chalk = require('chalk')

const productsRepo = require('../repositories/products')
const cartRepo = require('../repositories/cart')
const productsPublicTemplate = require('../views/products/publicList')
const cartPublicTemplate = require('../views/products/cartList')

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

router.get('/cart', async (req, res) => {
  // console.log('ello')
  const cartForUser = await cartRepo.getOne(req.session.id)
  if (!cartForUser) {
    console.log(chalk.red('no session yet'))
    res.redirect('/products/public')
  }
  const cartView = []
  if (cartForUser ) {
    if (cartForUser.products)
    for (let entry of cartForUser.products) {
      const product = await productsRepo.getOne(entry[0])
      const title = product.title
      const image = product.image
      const price = product.price
      const quantity = entry[1]
      const cartViewEntry = { title, price, quantity, image }
      cartView.push(cartViewEntry)
    }
  res.send(cartPublicTemplate(cartView))
  }

})

module.exports = router
