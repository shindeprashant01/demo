const express= require("express");
const { registerUser,
     loginUser,
      logoutUser, 
      forgotPassword,
       resetPassword, 
       getUserDetails, 
       updatePassword,
       updateProfile,
       getAllUsers,
       getSingleUser,
       updateUserRole,
       deleteUser} = require("../controllers/userController");
const { isAthenticatedUser, authorizeRoles,} = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logoutUser);

router.route("/me").get(isAthenticatedUser, getUserDetails);

router.route("/password/update").put(isAthenticatedUser,updatePassword);

router.route("/me/update").put(isAthenticatedUser,updateProfile);

router.route("/admin/users").get(isAthenticatedUser,authorizeRoles("admin"),getAllUsers);

router.route("/admin/user/:id")
.get(isAthenticatedUser,authorizeRoles("admin"),getSingleUser)
.put(isAthenticatedUser,authorizeRoles("admin"), updateUserRole)
.delete(isAthenticatedUser,authorizeRoles("admin"),deleteUser)

module.exports = router;