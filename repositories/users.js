const { isUtf8 } = require('buffer');
const fs = require('fs');
const { stringify } = require('querystring');

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

  async create(attributes){
    const records = await this.getAll();
    records.push(attributes);
    await fs.promises.writeFile(this.filename, JSON.stringify(records), {econding: 'utf8'});
  }
}

const test = async () => {
  const repo = new UsersRepository('users.json');

  const users = await repo.getAll();
 
  console.log(users);

  await repo.create({email: ... @ ... password: ...});

  const updatedUsers = await repo.getAll(); // Fetch updated users

  console.log(updatedUsers); // Log the updated users
}

test()