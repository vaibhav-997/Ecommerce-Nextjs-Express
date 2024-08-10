import {Router} from 'express';
import { addProduct, updateProduct, deleteProduct, getProductById, getAllProducts, productForCategory, searchProductBasedOnText } from '../controllers/product.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/category').get(productForCategory)
router.route('/search').get(searchProductBasedOnText)

router.route('/add-product').post(upload.single('image'), addProduct)
router.route('/get-all-products').get(getAllProducts)
router.route('/get-product-by-id/:id').get(getProductById)
router.route('/update-product/:id').post(upload.single('image'), updateProduct)
router.route('/delete-product/:id').delete(deleteProduct)


export default router