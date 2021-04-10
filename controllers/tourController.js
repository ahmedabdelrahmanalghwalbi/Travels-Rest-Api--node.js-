const { query } = require("express");
const Tour = require("../models/tourModel");

exports.getAllTours = async (req, res, next) => {
    try {
        //prepare the req.query to fitering
        const queryObj = { ...req.query };
        const execludedQueries = ["page", "sort", "limit", "fields"];
        execludedQueries.forEach(el => delete queryObj[el]);
         let query = Tour.find(queryObj);
        //implementing sorting
        if (req.query.sort) {
            const sortedBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortedBy);
        } else {
            query.sort('-createdAt');
        }
       // implementing limiting fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }
        const tours = await query;
        res.status(201).json({
            status: "success",
            tours:tours.length,
            data: {tours}
        })
        console.log("test 2");
    } catch (ex) {
        console.log(`error in get all tours${ex}`);
        res.status(400).json({
            status: "fail",
            message:`error in get all Tours${ex} `
        })
    }
    
}
exports.getTour = async (req, res, next) => {
    try {
        const tourId = req.params.id;
        const tour = await Tour.findById(tourId).populate('reviews');
        //const tour = await Tour.findOne({_id:req.params.id});
        res.status(201).json({
            status: "success",
            data: { tour }
        });
        next();
    } catch (ex) {
        console.log(`error in get a Tour with Id ${ex}`);
        res.status(400).json({
            status: "fail",
            message:`error in get a Tour by id${ex}`,
        })
        next();
    }
}
exports.createTour = async (req, res, next) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: { newTour }
        });
        next();
    } catch (ex) {
        console.log(`error in create a new Tour ${ex}`);
        res.status(400).json({
            status: "fail",
            message:`error in create a new Tour${ex}`
        });
        next(); 
    }
}
exports.updateTour = async (req, res, next) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators:true
        })
        res.status(201).json({
            status: 'success',
            data: { tour }
        });
        next();
    } catch (ex) {
        console.log(`error in update a Tour with Id ${ex}`);
        res.status(400).json({
            status: "fail",
            message: `error in update a Tour by id${ex}`,
        });
        next();
    }
}
exports.deleteTour = async (req, res, next) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(201).json({
            status: "success"
        });
        next();
    } catch (ex) {
        console.log(`error in delete a Tour with Id ${ex}`);
        res.status(400).json({
            status: "fail",
            message: `error in delete a Tour by id${ex}`,
        });
        next();
    }
}

exports.getTourStatistics = async (req, res, next) => {
    try {
        const stats = await Tour.aggregate([
            //aggregate statges piplines
            //we can repeat any statge 
            {
                $match: { ratingsAverage: {$gte:4.5}}
            },
            {
                $group: {
                    _id: {$toUpper:'$difficulty'},
                    //in _id we introduce the fields that we want to group it
                    //we enter the field that we want to calc it statistics in _id,for example
                    //if we pass "$difficulty" we will get the statistics of each level of difficulty
                    //{hard ,medium,easy}
                    numTours: { $sum: 1 },
                    //thats works as a counter even each tour through by thr pep line
                    numRating:{$sum:"$ratingsQuentity"},
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: "$price" },
                    maxPrice: { $avg: "$price" },
                    minPrice: {$min:"$price"}
                }
            },
            {
                $sort: { avgPrice: 1 }
                //we will sort the result from the heighest on to the lowest ont
            }
        ]);
        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        });
    } catch (ex) {
       console.log(`error in get a tour statistics ${ex}`);
        res.status(400).json({
            status: "fail",
            message:`error in get a tour statistics ${ex}`,
        }) 
    }
}

//get tours within an distance by defining my location (lon & lat) and defining the radius that 
//i want tours within, then i used radius and (lon $ lat) of my location as query params then the result
//will be the tours that located inside the radius around my location.
exports.getToursWithin = async (req, res, next) => {
    try {
        const { distance, latlon, unit } = req.params;
        const [lat, lon] = latlon.split(',');
        //here i will calculate the radius that i want the tours within by looking first to the type 
        //of the unit and calculate the correct radius.
        const radius = unit == "mi" ? distance / 3963.2 : distance / 6378.1;

        if (!lat || !lon) {
            res.status(400).json({
                status: "fail",
                message: "Please provide latitude and longitude in the format lat,lon"
            });
            next();
        }
        //here i used geospatial query $geoWithin and used inside it a $centerSphere operator that 
        //take the lon and lat of my current location and the radius that i want tours within.
        const tours = await Tour.find({
            startLocation: { $geoWithin: { $centerSphere: [[lon, lat], radius] } }
        });
        res.status(200).json({
            status: 'success',
            data: {tours}
        });
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `failed with get the tour with in ${ex}`,
        });
        console.log(`failed with get the tour with in ${ex}`);
    }
}

// here i will calculate the distances for all tours that around a certain point and the results 
// are the distances between tours and a certain point.
exports.getDistances = async (req, res, next) => {
    try {
        const { latlon, unit } = req.params;
        const [lat, lon] = latlon.split(',');
        if (!lat || !lon) {
            res.status(400).json({
                status: "fail",
                message: "Please provide latitude and longitude in the format lat,lon"
            });
            next();
        }
         const distances = await Tour.aggregate([
            {
                 $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [lon * 1, lat * 1]
                     },
                distanceField: 'distance',
                distanceMultiplier: 0.001
            }
    },
  ]);

        res.status(200).json({
        status: 'success',
        data: {distances}
  });
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `failed with getting distances from point ${ex}`
        });
        console.log(`failed with getting distances from point ${ex}`)
    }
}