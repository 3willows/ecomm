const fs = require('fs');

class UsersRepository {
 constructor(filename){
  if (!filename){
    throw new Error('creating repo requires filename');
  }

  this.filename = filename;
  try {
    fs.accessSync(this.filename)
  } catch (err) {
    fs.writeFileSync(this.filename, []);
  }
 }
}

const repo = new UsersRepository('users.json');