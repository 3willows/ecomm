const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);
class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('creating repo needs file name')
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename)
    } catch (error) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    // open the file called this.filename
    // read its contents
    const content = await fs.promises.readFile(this.filename, { encoding: 'utf8' });
    // parse the contents
    const data = JSON.parse(content);
    // return the parsed data
    return data;
  }

  async create(attributes) {
    //attribute = { email : '', password: '' }
    attributes.id = this.randomId();

    const salt= crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attributes.password, salt, 64);

    const records = await this.getAll();
    
    const record = {
      ... attributes,
      password: `${buf.toString('hex')}.${salt}`
    };
    records.unshift(record);

    await this.writeAll(records);

    return attributes;
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  randomId() {
    return crypto.randomBytes(5).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => (record.id !== id));
    await this.writeAll(filteredRecords);
  }

  async update(id, attributes) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    Object.assign(record, attributes);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
    let found = true;
      for (let key in filters) {
        // console.log(record[key]);
        // console.log(filters[key]);
        if (record[key] !== filters[key])
          found = false;
      }
      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository('users.json');