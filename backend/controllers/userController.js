const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.status(201).send({ user, token });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.send({ user, token });
  } catch (error) {
    return res.status(400).send(error);
  }
};
