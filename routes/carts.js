const router = require("express").Router();
const _ = require("lodash");
const { validate, Cart } = require("../models/cart");
const validator = require("../middleware/validate");
const admin = require("../middleware/admin");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");




//get all carts
router.get("/", [auth, admin], async (req, res) => {
    const carts = await Cart.find().sort('-createdAt').select('-__v');
    res.send(carts);
});

//create a new cart
router.post('/', [auth, validator(validate)], async (req, res) => {

    const cart = new Cart(req.body);
    await cart.save();

    res.send(cart);
});


//update cart
router.put('/:id', [auth, objId, validator(validate)], async (req, res) => {

    const cart = await Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, {
        new: true
    });

    if (!cart) return res.status(404).send('The cart with the given ID was not found.');

    res.send(cart);
});


//delete cart
router.delete('/:id', [auth, objId], async (req, res) => {
    const cart = await Cart.findByIdAndRemove(req.params.id);

    if (!cart) return res.status(404).send('The cart with the given ID was not found.');

    res.send(cart);
});

//user specific cart
router.get('/:id', [auth, objId], async (req, res) => {
    const cart = await Cart.findById(req.params.id);

    if (!cart) return res.status(404).send('The cart with the given ID was not found.');

    res.send(cart);
});

module.exports = router;