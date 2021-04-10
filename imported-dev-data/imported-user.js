const mongoose = require("mongoose");
const fs = require("fs");
const User = require("../models/userModel");

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
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8'));
//importing data  to data base
const importedData = async () => {
    try {
        await User.create(users);
        console.log("users added duccessfully");
        process.exit();
    } catch (ex) {
        console.log(ex);
    }
    process.exit();
}
//deleting data from the data base
const deleteData = async () => {
    try {
        await User.deleteMany();
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