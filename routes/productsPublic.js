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
  if (cartForUser) {
    if (cartForUser.products)
      for (let entry of cartForUser.products) {
        // console.log(entry[0])
        const product = await productsRepo.getOne(entry[0])
        // console.log(product)
        const id = entry[0]
        const title = product.title
        const image = product.image
        const price = product.price
        const quantity = entry[1]
        const cartViewEntry = { id, title, price, quantity, image }
        cartView.push(cartViewEntry)
      }
    res.send(cartPublicTemplate(cartView))
  }
})

router.post('/cart/:id/delete', async (req, res) => {
  const productId = req.params.id
  const cartForUser = await cartRepo.getOne(req.session.id)
  if (!cartForUser) {
    console.log(chalk.red('no session yet'))
    res.redirect('/cart')
  }
  if (cartForUser) {
    if (cartForUser.products) {
      // console.log(cartForUser.products)
      // console.log(productId)
      console.log(cartForUser.products.findIndex(arr => arr[0] === productId))
      const products =  cartForUser.products
      const index = products.findIndex(arr => arr[0] === productId)
      products.splice(index, 1)
      // console.log(cartForUser.products)
      await cartRepo.update(req.session.id, { products })
    }
    res.redirect('/cart')
  }
})

module.exports = router
