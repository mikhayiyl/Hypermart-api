const mongoose = require("mongoose");
const Joi = require("joi");
const { categorySchema } = require("./category");
const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "no pic"
        },
        sizes: [
            {
                size: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ]
        ,
        category: {
            type: categorySchema,
            required: true,
        },
        color: {
            type: String,
        },

        numberInStock: {
            type: Number,
            required: true,
        },
        sex: {
            type: String,
            enum: ['men', 'women', 'unisex', 'none'],
            default: "none"
        },

    },
    { timestamps: true }
);


const Product = mongoose.model("Product", productSchema);

function validate(product) {
    const schema = {
        image: Joi.string(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        numberInStock: Joi.number().required(),
        color: Joi.string().optional(),
        sizes: Joi.array(),
        categoryId: Joi.objectId().required(),
        sex: Joi.string().min(3).max(6),
    };
    return Joi.validate(product, schema);
}

module.exports.Product = Product;
module.exports.validate = validate;


