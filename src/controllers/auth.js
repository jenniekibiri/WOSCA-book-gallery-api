/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const model = require('../models/index');

exports.signup = async (req, res) => {
  const {
    username, email, confirmPassword,
  } = req.body;

  let { password } = req.body;

  if (password !== confirmPassword) {
    return res.json({ message: "passwords don't match" });
  }

  await model.User.findOne({
    where: {
      email,

    },

  }).then((user) => {
    if (user) {
      return res.status(403).json({
        error: 'email is already taken Login!',
      });
    }
  });

  bcrypt.hash(password, 10, (err, hash) => {
    password = hash;

    model.User.create({
      username,
      email,
      password,

    }).then((user) => {
      const { id } = user;
      const token = jwt.sign({ id }, process.env.secret);
      return res.json({
        token,
        user: username,
      });
    })

      .catch((error) => error);
  });
};