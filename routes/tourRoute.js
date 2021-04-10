const express = require("express");
const router = express.Router();
const {getAllTours,getTour,createTour,updateTour,deleteTour,getTourStatistics,getToursWithin,getDistances} = require("../controllers/tourController");
const { checkAuth } = require("../middlewares/check_auth");
const { roleBased } = require("../middlewares/role_based");
const reviewRouter = require("../routes/reviewRoute");
const multer = require("multer");
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `tour-${file.originalname}-${Date.now()}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb("not an Image", false);
    }
};
const upload = multer({
    storage: multerStorage,
    multerFilter: multerFilter,
})
// upload multiple images using multer 
// here in the tour model we have 2 fields that i want to apply on them the multiple upload images
// we have a field that called imageCover that accepted single photo so that i will use with it // upload.single("imageCover"); //.
// we have also a field called images that accepted an array of images so that i will use with it //upload.array('images',5); //
//so that we will combie this two ways to upload images in // uploads.fiels([{},{},...]) //
router.route('/').get(getAllTours).post(checkAuth, roleBased("admin", "lead-guide"), upload.fields([
    { name: 'imageCover', maxCount: 1 },
    {name:'images',maxCount:3}]), createTour);
router.route('/:id').get(getTour).put(checkAuth,roleBased("admin","lead-guide"), upload.fields([
    { name: 'imageCover', maxCount: 1 },
    {name:'images',maxCount:3}]),updateTour).delete(checkAuth,roleBased("admin","lead-guide"),deleteTour);
router.route('/get-tour-stats').get(getTourStatistics);
//get tours with in specific radius
// we pass the distance that we want tours within in the /:distance and we pass the current location 
//of the user that want the tours within a certain distance in/:latlng.
//we defined a /:unit to specify a unit if the distance that with KM or Mill.
router.route('/tours-within/:distance/center/:latlon/unit/:unit').get(getToursWithin);
//calculating a distance from a point
router.route('/distances/:latlon/unit/:unit').get(getDistances);
//step one of creating a nested route for create a review with the id of the current logged user
//and the certain tour that i want to add the review on it
// router.route('/:tourId/reviews', checkAuth,roleBased("user"),createReview);
router.use('/:tourId/reviews', reviewRouter);
module.exports = router;