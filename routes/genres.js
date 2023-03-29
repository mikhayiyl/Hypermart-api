const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validator = require("../middleware/validate");
const { Genre, validate } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const genres = await Genre.find()
        .select("-__v")
        .sort("name");
    res.send(genres);
});

router.post("/", [validator(validate), auth], async (req, res) => {

    let genre = await Genre.findOne({ name: req.body.name });
    if (genre) return res.status(400).send("genre already exists");

    genre = new Genre(req.body);
    genre = await genre.save();

    res.send(genre);
});

router.put("/:id", [validator(validate), auth, validateObjectId], async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    );

    if (!genre)
        return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre)
        return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id).select("-__v");

    if (!genre)
        return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
});

module.exports = router;
