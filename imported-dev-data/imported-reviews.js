const mongoose = require("mongoose");
const fs = require("fs");
const Review = require("../models/reviewModel");

mongoose.connect("mongodb://localhost:27017/tours", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to the data base successfully");
}).catch((ex) => {
    console.log(`failed to connect with the database ${ex}`);
});

// Reading Json File by Translate it to java script objects
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf-8'));
//importing data  to data base
const importedData = async () => {
    try {
        await Review.create(reviews);
        console.log("reviews added duccessfully");
        console.log(reviews.length);
        process.exit();
    } catch (ex) {
        console.log(ex);
    }
    process.exit();
}
//deleting data from the data base
const deleteData = async () => {
    try {
        await Review.deleteMany();
        console.log("Data Deleted successfuly");
        process.exit();
    } catch (ex) {
        console.log(ex);
    }
    process.exit();
}

if (process.argv[2] === "--import") {
    importedData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
console.log(process.argv);