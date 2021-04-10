exports.roleBased = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(401).json({
                status:"fail",
                message: `access denied becouse the user role id ${req.user.role}`
            });
        }
        next();
    }
}