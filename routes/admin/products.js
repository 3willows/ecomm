const express = require('express')
const multer = require('multer')

const productsRepo = require('../../repositories/products')
const productsNewTemplate = require('../../views/products/new')
const productsTemplate = require('../../views/products/list')
const { requireTitle, requirePrice } = require('./validators')

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

router.get('/admin/products/list', async (req, res) => {
  let list = ''
  const data = await productsRepo.getAll()
  const items = data.map(obj => [obj.title, obj.price])
  for (let item of items) {
    list += `<li> Title: ${item[0]} \t Price:${item[1]}<li>`
  }
  if (list) {
    res.send(productsTemplate(list).replace('is-hidden', ''))
  }
})

module.exports = router
