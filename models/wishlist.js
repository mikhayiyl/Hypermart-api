const Joi = require('joi');
const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },

    userId: {
        type: String,
        required: true,
    },

},
    { timestamps: true }
);

const WishList = mongoose.model('WishList', wishListSchema);

function validate(item) {
    const schema = {
        productId: Joi.objectId().required(),
        userId: Joi.objectId().required(),
    };

    return Joi.validate(item, schema);
}

exports.WishList = WishList;
exports.validate = validate;