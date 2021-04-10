const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.checkAuth =async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            if (token) {
                const decodedToken = jwt.verify(token,"jwbsecretkey");
                req.user = await User.findById(decodedToken.id);
                next();
            }
            else {
                handleError(null, next);
            }
        }
        else {
            handleError(null, next);
        }
    }
    catch (error) {
        handleError(error, next);
    }
};

function handleError(error, next) {
    if (error) {
        error.message = 'user not authenticated (auth failed)';
        next(error);
    }
    else {
        const error = new Error();
        error.message = 'user not authenticated (auth failed)';
        next(error);
    }
}