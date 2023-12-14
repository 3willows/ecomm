const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ( entry ) => {
  return layout({
    content: `
    <ul class="help is-danger is-hidden" id = "imageInput">${entry} </ul>
    `
  });
};
