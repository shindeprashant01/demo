const express = require("express");
const { newOrder, 
    getSingleOrder, 
    myOrders, 
    getALLOrders, 
    updateOrder, 
    deleteOrder} = require("../controllers/orderController");
const { isAthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAthenticatedUser, newOrder);

router.route("/order/:id").get(isAthenticatedUser,authorizeRoles("admin"),getSingleOrder);

router.route("/orders/me").get(isAthenticatedUser,myOrders);

router
.route("/admin/orders").get(isAthenticatedUser,authorizeRoles("admin"),getALLOrders)

router
.route("/admin/order/:id")
.put(isAthenticatedUser,authorizeRoles("admin"),updateOrder)
.delete(isAthenticatedUser,authorizeRoles("admin"),deleteOrder);





module.exports=router;