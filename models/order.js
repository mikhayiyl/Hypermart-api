const mongoose = require("mongoose");
const Joi = require("joi");
const orderSchema = new mongoose.Schema(
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
            size: {
                type: String,
                required: true,
            },
            color: {
                type: String,
            }
        }
        ],

        amount: {
            type: Number,
            required: true,
        },
        address: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            default: "pending"
        }

    },
    { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);

function validate(order) {
    const schema = {
        userId: Joi.objectId().required(),
        products: Joi.array().required(),
        amount: Joi.number().required(),
        address: Joi.object().required(),
        status: Joi.string(),
    };
    return Joi.validate(order, schema);
}

module.exports.Order = Order;
module.exports.validate = validate;
