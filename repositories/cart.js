const Repository = require('./repository')

// const util = require('util');
// const crypto = require('crypto');
// const scrypt = util.promisify(crypto.scrypt);

class cartRepository extends Repository {
  async create (id, productId) {
    const records = await this.getAll()
    const existingRecord = await this.getOneBy({ id, productId })

    if (existingRecord) {
      let quantity = existingRecord.quantity
      quantity++
      console.log(quantity)
      await this.update(id, {quantity})
    } else {
      const object = {
        id,
        productId,
        quantity: 1
      };
      records.push(object);
      await this.writeAll(records); // Save the new record
    }
  }
}


module.exports = new cartRepository('cart.json')
