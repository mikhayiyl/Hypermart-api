const router = require("express").Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const validator = require("../middleware/validate");
const { User } = require("../models/user");

router.post("/", [validator(validate)], async (req, res) => {
  let user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("Invalid email or password");

  const password = await bcrypt.compare(req.body.password, user.password);

  if (!password) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const schema = {
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).required(),
  };
  return Joi.validate(user, schema);
}

module.exports = router;
