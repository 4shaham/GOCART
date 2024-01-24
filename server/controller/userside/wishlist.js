
const Wishlist = require('../../model/wishList.schema')
const { default: mongoose } = require("mongoose");
const Product = require("../../model/product.schema")

exports.wishlist = async (req, res) => {

    console.log('hiii', req.body.productId);
    const userId = req.session.userId
    const productId = req.body.productId

    const data = await Wishlist.findOne({ userId: userId })
    if (data) {
        console.log('hii');
        await Wishlist.findOneAndUpdate(
            { userId: userId },
            { $push: { wishlstItems: productId } }
        );
        res.send({ url: '/' })
    } else {

        const wishlist = new Wishlist({
            userId: userId,
            wishlstItems: productId
        })
        await wishlist.save()
        res.send({ url: '/' })
    }


}

// delete wishlist  


exports.deletewishlist = async (req, res) => {

    try {
        console.log('kll', req.body.productId);
        const userId = req.session.userId
        const productId = req.body.productId

        await Wishlist.findOneAndUpdate(
            { userId: userId },
            { $pull: { wishlstItems: productId } }
        )
        res.send({ url: '/' })
    } catch (err) {
        res.send(err)
    }



}





exports.delteWishlistpageItems = async (req, res) => {

    try {
        const userId = req.session.userId
        const productId = req.query.id

        await Wishlist.findOneAndUpdate(
            { userId: userId },
            { $pull: { wishlstItems: productId } }
        )
        res.redirect('/wishlist')

    } catch (err) {
        res.send(err)
    }


}



// axios 

exports.findWishlistDetail = async (req, res) => {
    const userId = req.query.userId
    console.log(userId);
    try {

        console.log('jiiiii');
        const product = await Wishlist.find({ userId: userId })
        console.log('shaaha', product);
        res.send(product)

    } catch (err) {
        res.send(err)
    }

}


exports.findWishlist = async (req, res) => {
    const userId = req.query.userId
    console.log(userId);
    try {

        console.log('jiiiii');
        const product = await Wishlist.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            // {
            //     $unwind: "$wishlstItems"
            // },
            {
                $lookup: {
                    from: "products",
                    localField: "wishlstItems",
                    foreignField: "_id",
                    as: "productDetails"

                }
            },
            {
                $project: {
                    productDetails: 1
                }
            }
        ])
        console.log('shaaha', product);

        res.send(product)

    } catch (err) {
        res.send(err)
    }

}
