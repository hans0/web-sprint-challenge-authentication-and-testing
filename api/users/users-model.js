const db = require('../../data/dbConfig')

module.exports = {
  findById,
  add,
}

function findById(id) {
  return db('users as u')
    .select('u.id', 'u.username', 'u.password');
}

async function add(user) {
  console.log(db)
  const [id] = await db('users').insert(user);
  return findById(id);
}