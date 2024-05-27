import { Router } from "express";
import { verifyAndInsertUser, getAllProducts, addProductToCart, removeProductFromCart, getCartProducts, updateProductQuantity, createOrder, cancelOrder, getPedidosByUser, addProduct, getProducts, updateProduct, deleteProduct } from "../AllControllers.js";

const router = Router();

router.post("/verifyAndInsertUser", verifyAndInsertUser);
router.get("/getAllProducts", getAllProducts);
router.post("/addProductToCart", addProductToCart);
router.post("/removeProductFromCart", removeProductFromCart);
router.get("/getCartProducts/:id", getCartProducts);
router.post("/updateProductQuantity", updateProductQuantity);
router.post("/createOrder", createOrder);
router.get("/getPedidos/:id", getPedidosByUser);
router.post("/cancelOrder", cancelOrder);
router.post("/producto", addProduct);
router.get("/producto", getProducts);
router.put('/producto/:id', updateProduct);
router.delete('/producto/:id', deleteProduct);


export default router;

