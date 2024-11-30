const express = require("express");
const {
  uploadCSV,
  listProducts,
  listProductsByID,
  previewImage,
} = require("../controllers/productController");
const fileUpload = require("../middlewares/fileUpload");

const router = express.Router();

router.post("/upload", fileUpload.single("file"), uploadCSV);
router.get("/list", listProducts);
router.get("/:id", listProductsByID);
router.get('/:id/preview', previewImage);

module.exports = router;
