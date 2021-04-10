const Review = require("../models/reviewModel");

exports.getAllReviews = async (req, res, next) => {
    try {
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };
        const reviews = await Review.find(filter);
        res.status(200).json({
            status: "success",
            data: { reviews }
        })
} catch (ex) {
    res.status(400).json({
        status: "fail",
        message: `failed with get all reviews ${ex}`
    });
    console.log(`failed with get all reviews ${ex}`);
    next();
}
}


exports.createReview = async (req, res, next) => {
    try {
        //the second step of creating a nested route to create a review on a certain tour with it 
        // id and the id of the current logged user
        if (!req.body.user) req.body.user = req.user.id;
        if (!req.body.tour) req.body.tour = req.params.tourId;
        const newReview = await Review.create(req.body);
        res.status(200).json({
        status: "success",
        data: { newReview }
    })
    
} catch (ex) {
    res.status(400).json({
        status: "fail",
        message: `failed with create the review ${ex}`
    });
    console.log(`failed with create the review ${ex}`);
    next();
}
}


exports.getReviewById = async (req, res, next) => {
    try {
    
} catch (ex) {
    res.status(400).json({
        status: "fail",
        message: `failed with get review by id ${ex}`
    });
    console.log(`failed with get review by id ${ex}`);
    next();
}
}


exports.updateReview = async (req, res, next) => {
    try {
    
} catch (ex) {
    res.status(400).json({
        status: "fail",
        message: `failed with update the review ${ex}`
    });
    console.log(`failed with update the review ${ex}`);
    next();
}
}


exports.deleteReview = async (req, res, next) => {
    try {
    
} catch (ex) {
    res.status(400).json({
        status: "fail",
        message: `failed with delete the review ${ex}`
    });
    console.log(`failed with delete the review ${ex}`);
    next();
}
}