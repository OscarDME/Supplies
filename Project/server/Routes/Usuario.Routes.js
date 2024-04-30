import { Router } from "express";
import { verifyAndInsertUser, getAllProducts, addProductToCart, removeProductFromCart, getCartProducts } from "../AllControllers.js";

const router = Router();

router.post("/verifyAndInsertUser", verifyAndInsertUser);
router.get("/getAllProducts", getAllProducts);
router.post("/addProductToCart", addProductToCart);
router.post("/removeProductFromCart", removeProductFromCart);
router.get("/getCartProducts/:id", getCartProducts);

export default router;

