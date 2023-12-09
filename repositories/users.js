const { isUtf8 } = require('buffer');
const fs = require('fs');

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
}

const test = async () => {
  const repo = new UsersRepository('users.json');
  const users = await repo.getAll();
  console.log(users);
}

test()