const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    image: {
        type: String,
        required: true,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        image: Joi.string().required(),
        genreId: Joi.objectId().required(),

    };

    return Joi.validate(category, schema);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;