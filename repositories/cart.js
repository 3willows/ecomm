const Repository = require('./repository')
class cartRepository extends Repository {
  async create (id, productId) {
    const records = await this.getAll()
    const existingRecord = await this.getOneBy({ id })

    if (existingRecord) {
      const { products } = existingRecord
      const productEntry = existingRecord.products.find(
        entry => entry[0] === productId
      )
      if (productEntry) {
        console.log('updating old entry')
        let quantity = productEntry[1]
        quantity++
        products.splice(products.indexOf(productEntry), 1)
        products.push([productId, quantity])
      
      } else {
        console.log('brand new entry')
        products.push([productId, 1])
      }
      await this.update(id, { products })
    } else {
      const object = {
        id,
        products: [[productId, 1]]
      }
      records.push(object)
      await this.writeAll(records) // Save the new record
    }
  }
}

module.exports = new cartRepository('cart.json')
