const fs = require('fs');
const crypto = require('crypto');
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
    attributes.id = this.randomId();

    const records = await this.getAll();
    records.push(attributes);
    await this.writeAll(records);
  }

  async writeAll(records){
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));    
  }

  randomId(){
    return crypto.randomBytes(5).toString('hex'); 
  }

}

const test = async () => {
  const repo = new UsersRepository('users.json');

  const users = await repo.getAll();

  console.log(`before: ${JSON.stringify(users)}`);
  
  await repo.create({ email: "... @ ...", password: "..."});

  // const updatedUsers = await repo.getAll(); 

  // console.log(`after: ${JSON.stringify(updatedUsers)}`); 
  
}

test();