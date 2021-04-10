const express = require("express");
const router = express.Router();
const { registerController, loginController,getmeController,updateMeController,logoutController } = require("../controllers/userController");
const { checkAuth } = require("../middlewares/check_auth");
const multer = require("multer")
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${file.originalname}-${Date.now()}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb("not an Image", false);
    }
};
const upload = multer({
    storage: multerStorage,
    multerFilter: multerFilter,
});

router.route('/register').post(registerController);
router.route('/login').post(loginController);
router.delete('/logout', checkAuth,logoutController);
router.get('/me', checkAuth, getmeController);
router.put('/updateMe', checkAuth,upload.single('photo'), updateMeController);


module.exports = router;