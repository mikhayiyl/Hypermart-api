const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validator = require("../middleware/validate");
const { Category, validate } = require("../models/category");
const express = require("express");
const { Genre } = require("../models/genre");
const router = express.Router();

router.get("/", async (req, res) => {
    const categories = await Category.find()
        .select("-__v")
        .sort("name");
    res.send(categories);
});

router.post("/", [validator(validate), auth], async (req, res) => {
    const genre = await Genre.findById(req.body.genreId).select("-__v");
    if (!genre) return res.status(404).send("invalid genre");

    let category = await Category.findOne({ name: req.body.name });
    if (category) return res.status(400).send("category already exists");

    category = new Category(req.body);
    category.genre = { ...genre };
    await category.save();

    res.send(category);
});

router.put("/:id", [validator(validate), validateObjectId, auth], async (req, res) => {

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("invalid genre");

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: req.body.image,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
        },
        {
            new: true
        }
    );

    if (!category)
        return res.status(404).send("The category with the given ID was not found.");

    res.send(category);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id);

    if (!category)
        return res.status(404).send("The category with the given ID was not found.");

    res.send(category);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const category = await Category.findById(req.params.id).select("-__v");

    if (!category)
        return res.status(404).send("The category with the given ID was not found.");

    res.send(category);
});



module.exports = router;
