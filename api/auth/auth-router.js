const router = require('express').Router();
const bcrypt = require('bcrypt');

const Users = require('../users/users-model');
const buildToken = require('./token-builder');
const checkUsernamePassword = require('../middleware/checkUsernamePassword');

router.post('/register', (req, res, next) => {
  // res.end('implement register, please!');
  /*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.
  DO NOT EXCEED 2^8 ROUNDS OF HASHING!
  
  1- In order to register a new account the client must provide `username` and `password`:
  {
    "username": "Captain Marvel", // must not exist already in the `users` table
    "password": "foobar"          // needs to be hashed before it's saved
  }
  */
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  /*
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  Users.add({ username, password: hashedPassword })
    .then(noidea => {
      res.status(201).json(noidea)
    })
    .catch(next)
  

});

router.post('/login', checkUsernamePassword, (req, res, next) => {
  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
  */
  let { username, password } = req.body;
  /*
    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user)
        res.status(200).json({
          message: `Welcome back ${user.username}`,
          token,
        });
      } else {
        res.status(401).json({ message: `invalid credentials` });
      }
    })
    .catch(next)
});

module.exports = router;
