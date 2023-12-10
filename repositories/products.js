const Repository = require('./repository');

// const util = require('util');
// const crypto = require('crypto');
// const scrypt = util.promisify(crypto.scrypt);

class productsRepository extends Repository {
  }
 

module.exports = new productsRepository ('products.json');