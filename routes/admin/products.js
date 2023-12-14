const express = require('express')
const multer = require('multer')

const productsRepo = require('../../repositories/products')
const productsNewTemplate = require('../../views/products/new')
const productsTemplate = require('../../views/products/index')
const { requireTitle, requirePrice } = require('./validators')

const usersRepo = require('../../repositories/users')

const router = express.Router()

// The line below does not let req.file show the buffer
// const uploadDisk= multer({ dest: 'uploads/' })

// The line below will save the thing instead as a string in the products.json
const upload = multer({ storage: multer.memoryStorage() })

const { requireImage, errorChecker } = require('../../middlewares')

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}))
})

router.post(
  '/admin/products/new',
  upload.single('image'),
  [requireTitle, requirePrice],
  errorChecker(productsNewTemplate),
  requireImage(productsNewTemplate),
  async (req, res) => {
    const { title, price } = req.body
    const image = req.file.buffer.toString('base64')
    await productsRepo.create({ title, price, image })
    return res.redirect('/admin/products/new')
  }
)

router.get('/admin/products', async (req, res) => {
  if (!(await usersRepo.getOne(req.session.userId))) {
    return res.redirect('/signin')
  }
  console.log(req.session.userId)
  console.log(req.session)
  const products = await productsRepo.getAll()
  res.send(productsTemplate({ products }))
})

module.exports = router
