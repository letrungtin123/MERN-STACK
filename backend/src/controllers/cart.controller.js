import Cart from '../models/cart.model.js';
import { HTTP_STATUS } from '../common/http-status.common.js';
import { TypeRole } from '../common/type.common.js';
import { cartService } from '../services/cart.service.js';
import { checkUserExist } from '../services/user.service.js';
import { productService } from '../services/product.service.js';

// Hàm kiểm tra user và sản phẩm
const validateUserAndProduct = async (userId, productId, res) => {
  const userExist = await checkUserExist(userId);
  if (!userExist) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: 'User not found',
      success: false,
    });
  }

  const productExist = await productService.getProductById(productId);
  if (!productExist) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Product not found',
      success: false,
    });
  }

  return { userExist, productExist };
};

export const cartController = {
  // add to cart
  addCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, ...product } = body;

    // kiểm tra userId gửi lên có trùng với userId trong token không
    if (userId !== _id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
        success: false,
      });
    }

    const { productExist } = await validateUserAndProduct(userId, product.productId, res);
    if (!productExist) return;

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({ userId });
    const calculateTotal = (product, productExist) => 
      productExist.sale > 0
        ? product.quantity * (productExist.price - productExist.sale)
        : product.quantity * productExist.price;

    if (!result) {
      // tạo mới giỏ hàng
      const newCart = await cartService.createCart(userId, []);
      newCart.carts.push(product);
      newCart.total = calculateTotal(product, productExist);
      await newCart.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Add to cart successfully',
        success: true,
      });
    }

    // lấy giỏ hàng của user nếu user đã có giỏ hàng
    const { carts } = result;
    const productExitInCarts = carts.filter(item => item.productId.toString() === product.productId);

    if (productExitInCarts.length > 0) {
      const itemExist = productExitInCarts.find(item => item.size === product.size && item.color === product.color);
      if (itemExist) {
        itemExist.quantity += product.quantity;
      } else {
        carts.push(product);
      }
    } else {
      carts.push(product);
    }

    result.total += calculateTotal(product, productExist);
    await result.save();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Add to cart successfully',
      success: true,
    });
  },

  // get cart by userId
  getCartByUserId: async (req, res) => {
    const { _id, role } = req.user;
    const params = req.query;
    const { statusUser } = params;

    if (role !== TypeRole.ADMIN && Object.keys(params).length > 0) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: 'You do not have permission to access',
        success: false,
      });
    }

    let query = statusUser ? { status: statusUser, userId: _id } : { userId: _id };
    const result = await cartService.getCartsByUserId(query, params);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get cart successfully',
      success: true,
      data: result,
    });
  },

  // get all carts
  getAllCarts: async (req, res) => {
    const { role } = req.user;
    const params = req.query;
    const { statusUser, _limit = 10, _page = 1, q } = params;

    if (role !== TypeRole.ADMIN && Object.keys(params).length > 0) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: 'You do not have permission to access',
        success: false,
      });
    }

    const option = {
      page: parseInt(_page, 10),
      limit: parseInt(_limit, 10),
      populate: [
        {
          path: 'userId',
          select: '_id email avatar fullname phone status',
        },
        { path: 'carts.productId', select: '_id nameProduct price sale images is_deleted status' },
      ],
    };

    let query = q ? { /* $or: [{ userId: { $regex: new RegExp(q), $options: 'i' } }] */ } : {};

    const result = await Cart.paginate(query, option);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all carts successfully',
      success: true,
      ...result,
    });
  },

  // update quantity product in cart
  updateQuantityProductInCart: async (req, res) => {
    const { _id } = req.user;
    const { userId, productId, productIdInCart } = req.body;
    const { status } = req.query;

    if (userId !== _id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
        success: false,
      });
    }

    const { productExist } = await validateUserAndProduct(userId, productId, res);
    if (!productExist) return;

    const result = await cartService.getCartsByUserId({ userId });
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    const { carts } = result;
    const productInCart = carts.find(item => item._id.toString() === productIdInCart);
    if (!productInCart) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product in cart not found',
        success: false,
      });
    }

    let isMaxQuantity = false;
    const updateQuantity = (increment) => {
      carts.forEach(item => {
        if (item._id.toString() === productIdInCart) {
          item.quantity += increment;
          const sizeExist = productExist.sizes.find(size => size.size === item.size && size.color === item.color);
          if (sizeExist && sizeExist.quantity < item.quantity) {
            item.quantity -= increment;
            isMaxQuantity = true;
          } else {
            result.total += increment * (productExist.sale > 0 ? productExist.price - productExist.sale : productExist.price);
          }
        }
      });
    };

    if (!status || status === 'increase') {
      updateQuantity(1);
      if (isMaxQuantity) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: 'The quantity of product is greater than the quantity in stock',
          success: false,
        });
      }
    } else {
      updateQuantity(-1);
      if (productInCart.quantity < 1) {
        result.carts = carts.filter(item => item._id.toString() !== productIdInCart);
      }
      if (result.total < 0) result.total = 0;
    }

    await result.save();

    return res.status(HTTP_STATUS.OK).json({
      message: `${status === 'increase' ? 'Increase' : 'Decrease'} quantity product in cart successfully`,
      success: true,
    });
  },

  // delete product in cart
  deleteProductInCart: async (req, res) => {
    const { _id } = req.user;
    const { userId, productIdInCart } = req.body;

    if (userId !== _id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
        success: false,
      });
    }

    const result = await cartService.getCartsByUserId({ userId });
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    const { carts } = result;
    const productInCart = carts.find(item => item._id.toString() === productIdInCart);
    if (!productInCart) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product in cart not found',
        success: false,
      });
    }

    result.carts = carts.filter(item => item._id.toString() !== productIdInCart);

    const productExist = await productService.getProductById(productInCart.productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    result.total -= productInCart.quantity * (productExist.sale > 0 ? productExist.price - productExist.sale : productExist.price);
    if (result.total < 0) result.total = 0;

    await result.save();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete product in cart successfully',
      success: true,
    });
  },
};
