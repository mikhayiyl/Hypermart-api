const mongoose = require("mongoose");
const Joi = require("joi");
const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        products: [{

            productId: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }
        ],

    },
    { timestamps: true }
);


const Cart = mongoose.model("Cart", cartSchema);

function validate(cart) {
    const schema = {
        userId: Joi.objectId().required(),
        products: Joi.array().required(),
    };
    return Joi.validate(cart, schema);
}

module.exports.Cart = Cart;
module.exports.validate = validate;
