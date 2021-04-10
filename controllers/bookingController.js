const Booking = require("../models/bookingModel");
exports.createBooking = async (req, res, next) => {
    try {
        
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `failed with create booking in this tour ${ex}`
        });
        console.log(`failed with create booking in this tour ${ex}`)
    }
}