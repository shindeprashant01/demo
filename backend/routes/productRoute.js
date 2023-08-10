const express= require("express");
const { getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductDetails, 
    createPraductReview, 
    getProductReviews,
    deleteReviews} = require("../controllers/productController");
const { isAthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get( getAllProducts);

router.route("/admin/product/new").post( isAthenticatedUser, authorizeRoles("admin"),createProduct);

router.route("/admin/product/:id")
.put( isAthenticatedUser, authorizeRoles("admin"),updateProduct)
.delete( isAthenticatedUser, authorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAthenticatedUser, createPraductReview);

router.route("/reviews")
.get(getProductReviews)
.delete(isAthenticatedUser,deleteReviews)

module.exports = router;



