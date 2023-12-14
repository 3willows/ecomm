const express = require('express')
const multer = require('multer')

const productsRepo = require('../../repositories/products')
const productsNewTemplate = require('../../views/products/new')
const productsTemplate = require('../../views/products/index')
const { requireTitle, requirePrice } = require('./validators')

const { checkUserId } = require('../../middlewares')

const router = express.Router()

// The line below does not let req.file show the buffer
// const uploadDisk= multer({ dest: 'uploads/' })

// The line below will save the thing instead as a string in the products.json
const upload = multer({ storage: multer.memoryStorage() })

const { requireImage, errorChecker } = require('../../middlewares')
const products = require('../../repositories/products')

router.get('/admin/products/new', checkUserId('/signin'), (req, res) => {
  res.send(productsNewTemplate({}))
})

router.post(
  '/admin/products/new',
  checkUserId('/signin'),
  upload.single('image'),
  [requireTitle, requirePrice],
  errorChecker(productsNewTemplate),
  requireImage(productsNewTemplate),
  async (req, res) => {
    const { title, price } = req.body
    const image = req.file.buffer.toString('base64')
    await productsRepo.create({ title, price, image })
    return res.redirect('/admin/products')
  }
)

router.get('/admin/products', checkUserId('/signin'), async (req, res) => {
  const products = await productsRepo.getAll()
  res.send(productsTemplate({ products }))
})

router.get(
  '/admin/products/:id/edit',
  checkUserId('/signin'),
  (req, res) => {
    res.send(productsNewTemplate({}))
  }
)

router.post(
  '/admin/products/:id/edit',
  checkUserId('/signin'),
  upload.single('image'),
  [requireTitle, requirePrice],
  errorChecker(productsNewTemplate),
  requireImage(productsNewTemplate),
  async (req, res) => {
    const id = req.params.id
    const product = await productsRepo.getOneBy(id);
   
    if (!product){
      return res.send('Product not found')
    }
    
    const { title, price } = req.body
    const image = req.file.buffer.toString('base64')
    try {await productsRepo.update(id, { title, price, image })}
    catch (err){
      return res.send('update failed')
    }
    return res.redirect('/admin/products')
  }
)

router.get(
  '/admin/products/:id/delete',
  checkUserId('/signin'),
  async (req, res) => {
    const id = req.params.id
    await productsRepo.delete(id)    
    const products = await productsRepo.getAll()
    res.send(productsTemplate({ products }))}
)

module.exports = router
