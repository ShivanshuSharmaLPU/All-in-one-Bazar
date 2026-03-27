import express from "express";
import { addProduct, deleteProduct, getAllProduct, getSingleProduct, updateProduct } from "../controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";
const router = express.Router();


router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  addProduct
);


router.get("/getallproducts", getAllProduct);
router.get("/:id", getSingleProduct);
router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);
router.put("/update/:productId", isAuthenticated, isAdmin, multipleUpload, updateProduct);


export default router;