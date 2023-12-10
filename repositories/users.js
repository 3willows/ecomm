const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);
class UsersRepository extends Repository {
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

    return record;
  }

  async comparePasswords(saved, supplied){
    const result = saved.split('.');
    const hashedSuppliedBuff= await scrypt(supplied, result[1], 64);

    return (result[0] === hashedSuppliedBuff.toString('hex'));
  }
}
 

module.exports = new UsersRepository('users.json');