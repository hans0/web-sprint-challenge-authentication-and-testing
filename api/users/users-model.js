const db = require('../../data/dbConfig')

module.exports = {
  findById,
  findBy,
  add,
}

function findById(id) {
  return db('users as u')
    .select('u.id', 'u.username', 'u.password');
}

function findBy(filter) {
  return db('users as u')
    .select('u.id', 'u.username', 'u.password')
    .where(filter)
}


async function add(user) {
  console.log(db)
  const [id] = await db('users').insert(user);
  return findById(id);
}