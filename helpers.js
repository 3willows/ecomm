module.exports = {
  getError(errors, property) {
    try {
      return errors.mapped()[property].msg
    } catch (errors) {
      return ''
    }
  },
  errorChecker(req, template){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send(template({ errors }));
    }
  }
}