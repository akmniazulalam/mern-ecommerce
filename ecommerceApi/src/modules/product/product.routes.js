const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split(".")[1])
  }
})

const upload = multer({ storage: storage })
const router = express.Router();
const {
  productController,
  updateProductController,
  getProductController,
  getSingleProductController,
  deleteProduct,
  deleteAllProduct
} = require("./product.controller");

router.post("/createproduct", upload.array('images', 10), productController); // max koyta image dite parbe. ar ekhane jodi array dewa hoy tokhon req.files hoye jay. single thakle tokhon req.file hoy
router.get("/getproduct", getProductController);
router.get("/singleproduct/:id", getSingleProductController);
router.patch("/updateproduct/:id", upload.array('images', 10), updateProductController);
router.delete("/deleteproduct/:id", deleteProduct);
router.delete("/deleteallproduct", deleteAllProduct);

module.exports = router;
