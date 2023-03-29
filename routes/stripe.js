const router = require("express").Router();
const config = require("config");
const stripe = require('stripe')(config.get("STRIPE_KEY"));


router.post('/', (req, res) => {

    stripe.charges.create({
        source: req.body.source,
        amount: req.body.amount,
        currency: "usd",
    }, (error, response) => {
        if (error) return res.status(500).send(error);
        res.send(response)
    })

})




module.exports = router;