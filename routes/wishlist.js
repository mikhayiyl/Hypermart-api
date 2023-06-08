const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validator = require("../middleware/validate");
const { WishList, validate } = require("../models/wishlist");
const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
    const products = await WishList.find({ userId: req.params.id });
    res.send(products);
});

router.post("/", [validator(validate), auth], async (req, res) => {

    let product = await WishList.findOne({ userId: req.body.userId, productId: req.body.productId });
    if (product) return res.status(400).send("product already exists");

    product = new WishList(req.body);
    product = await product.save();

    res.send(product);
});

//remove from wishlist

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const list = await WishList.findByIdAndRemove(req.params.id);

    if (!list)
        return res.status(404).send("The list with the given ID was not found.");

    res.send(list);
});

//clear wishList

router.delete("/clear/:id", [auth, validateObjectId], async (req, res) => {
    const list = await WishList.deleteMany({ userId: req.params.id });
    res.send(list);
});


module.exports = router;
