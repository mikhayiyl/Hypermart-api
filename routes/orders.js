const router = require("express").Router();
const { validate, Order } = require("../models/order");
const { User } = require("../models/user");
const validator = require("../middleware/validate");
const admin = require("../middleware/admin");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");



//get all orders
router.get("/", [auth, admin], async (req, res) => {
    const orders = await Order.find().sort('-createdAt').select('-__v');
    res.send(orders);
});

//all user  orders
router.get("/myorders/:id", [auth, objId], async (req, res) => {
    const orders = await Order.find({ userId: req.params.id }).sort('-createdAt').select('-__v');
    res.send(orders);
});



//monthy income
router.get('/income', [auth, admin], async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    const productId = req.query.productId;
    console.log(productId);



    const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth }, ...(productId && { products: { $elemMatch: { productId } } }) } },
        {
            $project: {
                month: { $month: "$createdAt" },
                sales: "$amount",
            }
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: "$sales" }
            },
        },
    ]);

    res.send(income);

});


//create a new order
router.post('/', [auth, validator(validate)], async (req, res) => {
    const user = await User.findByIdAndUpdate(req.body.userId, {
        address: req.body.address
    });
    if (!user) return res.status(400).send('Invalid user.');

    const order = new Order(req.body);
    await order.save();

    res.send(order);

});



//update order
router.put('/:id', [auth, admin, objId], async (req, res) => {

    const order = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, {
        new: true
    });

    if (!order) return res.status(404).send('The order with the given ID was not found.');

    res.send(order);
});


//delete order
router.delete('/:id', [auth, admin, objId], async (req, res) => {
    const order = await Order.findByIdAndRemove(req.params.id);

    if (!order) return res.status(404).send('The order with the given ID was not found.');

    res.send(order);
});

//user specific orders
router.get('/:id', [auth, admin, objId], async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).send('The order with the given ID was not found.');

    res.send(order);
});






module.exports = router;
