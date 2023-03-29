const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
    address: {
      location: {
        type: String,
        maxlength: 255,
      },
      phone: {
        type: String,
        minlength: 5,
        maxlength: 50,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "coco.png",
    },

    isStaff: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      image: this.image,
      isAdmin: this.isAdmin,
      isStaff: this.isStaff,
      phone: this.phone,
      address: this.address,
    },
    config.get("jwtPrivateKey")
  );
};


const User = mongoose.model("User", userSchema);

function validate(user) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).required(),
    address: Joi.object(),
    image: Joi.string(),
    isStaff: Joi.boolean(),
    isAdmin: Joi.boolean(),
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validate;
