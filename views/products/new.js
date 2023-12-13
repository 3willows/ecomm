const layout = require('../layout')
const { getError } = require('../../helpers')

module.exports = ({ errors }) => {
  return layout({
    content: `
    <form method ="POST" enctype = "multipart/form-data" >
    <input placeholder ="Title" name = "title" />
    // <p class="help is-danger">${getError(errors, 'title')}</p>
    <input placeholder ="Price" name = "price" />
    // <p class="help is-danger">${getError(errors, 'price')}</p>
    <input type = "file" name = "image" />
    <button>Submit</button>
    <form>
    `
  })
}
