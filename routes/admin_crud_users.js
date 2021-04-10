const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/check_auth");
const { roleBased } = require("../middlewares/role_based");
const {getAllUser,getUserById,createUserByAdmin,updateUserByAdmin,deleteUserByAdmin } = require("../controllers/adminController");


router.use(checkAuth);
router.use(roleBased("admin"));
router.route('/').get(getAllUser).post(createUserByAdmin);
router.route('/:id').get(getUserById).put(updateUserByAdmin).delete(deleteUserByAdmin);

module.exports = router;