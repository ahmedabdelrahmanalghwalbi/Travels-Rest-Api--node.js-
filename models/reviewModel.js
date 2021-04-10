const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required:[true,"revirew is required"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5,
        required:[true,"Rating is required"]
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required:[true,"review must belongs to a tour"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:[true,"review must belongs to a user"]
    }
},{
    toJSON: { virtuals: true },
    toObject:{virtuals: true},
});

//populate user and tour
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "tour",
        select: "name "
    }).populate({
        path: "user",
        select: "name photo"
    });
  next();
});

//we pass the tourId to the calcAverageRating to select the tour that i want 
//to calculate it is average ratings.
//this static method is used to calculate a stats of an certain tour  
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  // this points to current model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // i will update the ratings quentitiy and rating average fields in the Tour by passing the 
  // new nRatings and avgRationg that calculate from the aggregation to it
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRatings,
        ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5
    });
  }
    
  console.log(stats);
};
//here i will use the calcAverageRatings on each tour that i will save by calling the 
//post middleware and calling the calcAverageRatings by passing the current tour id to this static method. 
reviewSchema.post('save', function() {
  // this points to current review
  // i use this.constructor becouse Review doesnt work before creating it's model
  this.constructor.calcAverageRatings(this.tour);
});

//access calcAverageRatings before update and delete queries
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/,async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
})

module.exports = mongoose.model('Review', reviewSchema);