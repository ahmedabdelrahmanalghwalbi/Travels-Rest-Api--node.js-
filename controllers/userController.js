const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");

//Register Controller
exports.registerController=async(req, res, next) => {
    try {
        //ensure that user has been register before or not.
        let doseUserExist = await User.findOne({ "email": req.body.email });
        if (doseUserExist) return res.status(400).json({
            status:"fail",
            message: `this Email has been registered`
        });
        //register the user after the validation
        // const salt = await bcrypt.genSalt(10);
        // req.body.password = await bcrypt.hash(req.body.password, salt);
        const newUser = await User.create(req.body);
        const SECRET_Key = "jwbsecretkey";
        const token = Jwt.sign({
            id: newUser._id,
        },
            SECRET_Key,
        );
        res.status(200).json({
            status:"success",
            token: token,
            data:{newUser}
        });
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `user regiteration failed ${ex}`
        });
        console.log(`user regiteration failed ${ex}`);
        next();
    }
};

//Login Controller
exports.loginController= async (req, res, next) => {
    try {
        //ensure that user's email is valid or not.
        let validUser = await User.findOne({ "email": req.body.email });
        if (!validUser) return res.status(400).json({
            status:"fail",
            message: `Invalid email or password`
        });
        //ensure that user's password is valid or not.
        const validUserPassword = await bcrypt.compare(req.body.password, validUser.password);
        if (!validUserPassword) return res.status(400).json({
            status:"fail",
            message: `Invalid email or password`
        });
        const SECRET_Key = "jwbsecretkey";
        const token = Jwt.sign({
            id: validUser.id,
        },
            SECRET_Key,
        )
        res.status(200).json({
            status:"success",
            token: token,
        });
    } catch (ex) {
       res.status(400).json({
            status: "fail",
            message: `user login failed ${ex}`
        });
        console.log(`user login failed ${ex}`);
        next();
    } 
};

//logout user
exports.logoutController = async (req, res, next) => {
    try {
            const user = await User.findByIdAndDelete(req.user.id);
            res.status(200).json({
                status: "success",
            });
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

//get me controller
exports.getmeController = async (req, res, next) => {
    try {
        const me = await User.findById(req.user.id);
        res.status(200).json({
            status: "fail",
            data: { me }
        });
        next();
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `failed with get my information ${ex}`
        });
        console.log(`failed with get my information ${ex}`)
        next();
    }
}

//update the current user (me)
exports.updateMeController = async (req, res, next) => {
    try {
            const user = await User.findByIdAndUpdate(req.user.id, req.body, {
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

