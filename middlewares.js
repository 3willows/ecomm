const { json } = require('express')
const { validationResult } = require('express-validator')

module.exports = {
  errorChecker (templateFunc) {
    return (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.send(templateFunc({ errors }))
      }

      next()
    }
  },
  requireImage (templateFunc) {
    return (req, res, next) => {
      if (!req.file) {
        const errors = `Image is required! `
        console.log('triggered');
        console.log(templateFunc({ errors }))
        return res.send(templateFunc({ errors }).replace('is-hidden', ''))
      }

      next()
    }
  }
}
