const express = require("express");
const router = express.Router({mergeParams:true});
const { getAllReviews, createReview, getReviewById, updateReview, deleteReview } = require("../controllers/reviewController");
const {checkAuth} = require("../middlewares/check_auth");
const { roleBased } = require("../middlewares/role_based");

router.route('/').get(getAllReviews).post(checkAuth,roleBased("user"),createReview);
router.route('/:id').get(getReviewById).put(updateReview).delete(deleteReview);

module.exports = router;