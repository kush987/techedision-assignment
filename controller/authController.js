// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtsecret = require('../config/jwt-secret');
const { validationResult } = require('express-validator');
const {User} = require('../model/userModel');

const register = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  try {

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    //   role: req.body.role === null ? 'user' : req.body.role
    });
    

    return res.status(200).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error });
  }
};

const login = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }


  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, jwtsecret, { expiresIn: '1h' });

  return res.status(200).json({ userId: user.id,token });
};
module.exports = {
    register,
    login
}