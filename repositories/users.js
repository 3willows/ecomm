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

const test = async () => {
  const repo = new UsersRepository('users.json');

  const users = await repo.getAll();

  // console.log(`before: ${JSON.stringify(users)}`);

  // await repo.create({ email: "... @ ...", password: "..." });

  // await repo.update("2d8ae5a529", { email: "merry @ Christmas", password: "..." });

  // const updatedUsers = await repo.getAll(); 

  // console.log(`after: ${JSON.stringify(updatedUsers)}`); 

  // await repo.delete("1519c66e3b")

  // console.log(await repo.getOne("a647da2eaf"));

  console.log(await repo.getOneBy({"password": "mypassword" }));

}

test();