const User = require("../models/userModel");

//get all users
exports.getAllUser = async (req, res, next) => {
    try {
            const users = await User.find();
            res.status(200).json({
                status: "success",
                data: { users }
            });
            next();
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message:`failed to get all users to admin ${ex}`
        });
        console.log(`failed to get all users to admin ${ex}`);
        next();
    }
}

//get a user by id
exports.getUserById = async (req, res, next) => {
    try {
            const user = await User.findById(req.params.id);
            res.status(200).json({
                status: "success",
                data: { user }
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status:"fail",
            message: `failed to get user by id to admin ${ex}`
        });
        console.log(`failed to get user by id to admin ${ex}`);
        next();
    }
}

//create user
exports.createUserByAdmin = async (req, res, next) => {
    try {
            const user = await User.create(req.body);
            res.status(200).json({
                status: "success",
                data: { user }
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status:"fail",
            message: `failed to create user by admin ${ex}`,
        });
        console.log(`failed to create user by admin ${ex}`);
        next();
    }
}


//update user
exports.updateUserByAdmin = async (req, res, next) => {
    try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators:true
            });
            res.status(200).json({
                status: "success",
                data: { user }
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status:"fail",
            message:`failed to update user by admin ${ex}`,
        });
        console.log(`failed to update user by admin ${ex}`);
        next();
    }
}

//delete user
exports.deleteUserByAdmin = async (req, res, next) => {
    try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                status: "success",
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status:"fail",
            message: `failed to delete user by admin ${ex}`,
        });
        console.log(`failed to delete user by admin ${ex}`);
        next();
    }
}