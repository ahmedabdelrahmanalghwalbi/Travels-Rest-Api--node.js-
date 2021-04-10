const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, "Booking must belongs to a tour ...!"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Booking must belongs to a user ...!"]
    },
    price: {
        type: Number,
        required: [true, 'booking must have a price ...!']
    },
    quentity: {
        type: Number,
        default:1  
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject:{virtuals: true},
});

bookingSchema.virtual('total').get(function () {
    return price*quentity;
});

bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });
});

module.exports = mongoose.model('Booking', bookingSchema);