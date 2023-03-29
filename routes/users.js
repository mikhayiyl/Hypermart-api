const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { validate, User } = require("../models/user");
const validator = require("../middleware/validate");
const admin = require("../middleware/admin");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");


//get all users

router.get("/", [auth], async (req, res) => {
  const query = req.query.new

  const users = query ? await User.find().sort('-createdAt').limit(5).select('-__v')
    : await User.find().sort('-createdAt').select('-__v');
  res.send(users);
});



//Register a new user
router.post("/", [validator(validate)], async (req, res) => {

  const email = await User.findOne({
    email: req.body.email,
  });
  if (email) return res.status(400).send("Email Already in use");

  const user = new User(req.body);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();

  const registeredUser = _.pick(user, ["_id", "username", "email"])

  res.status(200)
    .header("access-control-expose-headers", "x-auth-token")
    .header("x-auth-token", token)
    .send({ registeredUser, token });
});


//update User details

router.put(
  "/:id",
  [auth, validator(validate), objId],
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!user)
      return res.status(404).send("The user with the given Id is not found");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    res.send(_.pick(user, ["username", "email", "phone", "address", "isAdmin", "isStaff", "image"]));
  }
);

//users statistics
router.get("/stats", [auth], async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const data = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" }
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 }
      }
    }
  ]);


  res.send(data);
});

//specific user

router.get("/:id", [auth, objId], async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .sort("username");
  if (!user)
    return res.status(404).send("The user with the given Id is not found");
  res.send(user);
});

//delete user
router.delete('/:id', [auth, admin, objId], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});




module.exports = router;