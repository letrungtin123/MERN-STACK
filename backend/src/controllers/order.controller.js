import { HTTP_STATUS } from '../common/http-status.common.js';
import { orderService } from '../services/order.service.js';
import { productService } from '../services/product.service.js';

export const orderController = {
  optionOrder: (params) => {
    const { _limit = 10, _page = 1, q, populate, ...rest } = params;

    let populateDefault = [
      { path: 'products.productId', select: '_id nameProduct desc images' },
      { path: 'userId', select: '_id email' },
    ];
    if (populate) {
      if (Array.isArray(populate)) {
        populateDefault = [...populateDefault, ...populate];
      } else {
        populateDefault.push(populate);
      }
    }
    let query = {};
    // if (q) {
    //   query = {
    //     $and: [
    //       {
    //         $or: [{ nameProduct: { $regex: new RegExp(q), $options: 'i' } }],
    //       },
    //     ],
    //   };
    // }
    // filter status
    if (rest.status) {
      query = {
        ...query,
        status: rest.status,
      };
    }

    const option = {
      limit: parseInt(_limit),
      page: parseInt(_page),
      populate: populateDefault,
    };
    return { option, query };
  },
  // create order
  createOrder: async (req, res) => {
    const { _id } = req.user;

    // check userId có trùng nhau hay không
    if (_id !== req.body.userId) {
      return res.status(HTTP_STATUS.FORBIDDENư).json({ message: 'Bạn không đặt được đơn hàng này!', success: false });
    }

    // thêm mới đơn hàng
    const newOrder = await orderService.createOrder(req.body);

    if (!newOrder) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Đặt hàng thất bại!', success: false });
    }

    // trừ đi số lượng sản phẩm trong kho
    newOrder.products.forEach(async (product) => {
      // lấy ra thông tin sản phẩm theo productId
      const productInfo = await productService.getProductById(product.productId);
      // tìm ra size và màu của sản phẩm đó và trừ đi số lượng sản phẩm
      const productSize = productInfo.sizes.find((size) => size.size === product.size && size.color === product.color);
      if (productSize) {
        const newQuantity = productSize.quantity - product.quantity;
        // cập nhật lại số lượng sản phẩm
        const result = await productService.updateQuantityProduct(product.productId, productSize._id, newQuantity);
        if (!result) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Đặt hàng thất bại!', success: false });
        }
      }
    });

    return res.status(HTTP_STATUS.CREATED).json({ message: 'Đặt hàng thành công!', success: true });
  },
  getOrdersByUserId: async (req, res) => {
    const { _id } = req.user;
    const { userId } = req.params;

    // check userId có trùng nhau hay không
    if (_id !== userId) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'Bạn không có quyền xem đơn hàng này!', success: false });
    }

    // lấy danh sách đơn hàng theo userId
    const orders = await orderService.getOrdersByUserId(_id);

    if (!orders) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Không tìm thấy đơn hàng!', success: false });
    }

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Lấy danh sách đơn hàng thành công!', success: true, data: orders });
  },

  // get all orders
  getAllOrders: async (req, res) => {
    const { _limit = 10, _page = 1, q, status } = req.query;
    const { option, query } = orderController.optionOrder({
      _limit,
      _page,
      q,
      status,
    });

    // startDate: 2024-07-16T14:36:52.972+00:00
    // endDate: 2024-07-16T14:36:52.972+00:00
    // datediff = endDate - startDate => dayjs(endDate).diff(dayjs(startDate), 'day')
    // tiềm kieems trong db createdAt >= startDate && createdAt <= endDate

    const orders = await orderService.getAllOrders(query, option);

    if (!orders) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Không tìm thấy đơn hàng!', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Lấy danh sách đơn hàng thành công!', success: true, ...orders });
  },

  // check status
  checkStatus: (previousStatus, currentStatus) => {
    switch (currentStatus) {
      case 'confirmed':
        if (previousStatus === 'pending') {
          return true;
        }
        return false;
      case 'delivery':
        if (previousStatus === 'confirmed') {
          return true;
        }
        return false;
      case 'completed':
        if (previousStatus === 'delivery') {
          return true;
        }
        return false;
      case 'cancelled':
        if (previousStatus === 'pending' || previousStatus === 'confirmed') {
          return true;
        }
        return false;
      default:
        return false;
    }
  },

  // cập nhật đơn hàng trạng thái đơn hàng
  updateOrder: async (req, res) => {
    const { _id } = req.user;
    console.log('🚀 ~ updateOrder: ~ req.user:', req.user);
    const { orderId } = req.params;
    const { status, message } = req.body;

    // lấy ra thông tin đơn hàng theo orderId
    const order = await orderService.getOrderById(orderId);

    // check xem có trường assignee không
    if (!order.assignee && order.status === 'pending') {
      // gán _id của user hiện tại vào trường assignee và cập nhật trạng thái đơn hàng => confirmed
      const updateOrder = await orderService.updateOrder({ _id: orderId }, { assignee: _id, status });
      if (!updateOrder) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Cập nhật đơn hàng thất bại!', success: false });
      }
      return res.status(HTTP_STATUS.OK).json({ message: 'Cập nhật đơn hàng thành công!', success: true });
    }

    // .find/ filter() => array method

    // check xem có phải là người được gán đơn hàng không
    if (order.assignee._id.toString() !== _id) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'Bạn không có quyền cập nhật đơn hàng này!', success: false });
    }

    // check xem trạng thái đơn hàng có hợp lệ không
    const checkStatusInvalid = orderController.checkStatus(order.status, status);
    if (!checkStatusInvalid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Trạng thái đơn hàng không hợp lệ!', success: false });
    }

    // trim() => tác dụng xoá các khoảng trắng ở đầu và cuối chuỗi
    // kiểm tra xem trạng thái đơn hàng có phải là cancelled không và message có giá trị không
    if (status === 'cancelled' && (!message || message.trim() === '')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Vui lòng nhập lý do hủy đơn hàng!', success: false });
    }

    if (status === 'cancelled' && message.trim() !== '') {
      // cập nhật trạng thái đơn hàng và lý do hủy đơn hàng
      const updateOrder = await orderService.updateOrder({ _id: orderId }, { status, reasonCancel: message });
      if (!updateOrder) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Cập nhật đơn hàng thất bại!', success: false });
      }
      return res.status(HTTP_STATUS.OK).json({ message: 'Cập nhật đơn hàng thành công!', success: true });
    }

    // cập nhật trạng thái đơn hàng
    const updateOrder = await orderService.updateOrder({ _id: orderId }, { status, reasonCancel: '' });
    if (!updateOrder) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Cập nhật đơn hàng thất bại!', success: false });
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Cập nhật đơn hàng thành công!', success: true });
  },

  // cancel order
  cancelOrder: async (req, res) => {
    const { role } = req.user;
    const { orderId } = req.params;
    const { message, status } = req.body;

    // lấy ra thông tin đơn hàng theo orderId
    const order = await orderService.getOrderById(orderId);
    // check role xem là admin hay user
    if (role === 'customer') {
      // check xem userId có trùng nhau không
      if (order.userId._id.toString() !== req.user._id) {
        return res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ message: 'Bạn không có quyền hủy đơn hàng này!', success: false });
      }

      // check status === pending
      if (order.status !== 'pending') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Không thể hủy đơn hàng!', success: false });
      }

      // cập nhật trạng thái đơn hàng và lý do hủy đơn hàng
      if (status !== 'cancelled' || !message || (message && message.trim() === '')) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: 'Vui lòng nhập lý do hủy đơn hàng!', success: false });
      }

      if (status === 'cancelled' && message.trim() !== '') {
        const updateOrder = await orderService.updateOrder({ _id: orderId }, { status, reasonCancel: message });
        if (!updateOrder) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Hủy đơn hàng thất bại!', success: false });
        }

        // cập nhật lại số lượng sản phẩm trong kho
        order.products.forEach(async (product) => {
          const productInfo = await productService.getProductById(product.productId);
          const productSize = productInfo.sizes.find(
            (size) => size.size === product.size && size.color === product.color,
          );
          if (productSize) {
            const newQuantity = productSize.quantity + product.quantity;
            // cập nhật lại số lượng sản phẩm
            const result = await productService.updateQuantityProduct(product.productId, productSize._id, newQuantity);
            if (!result) {
              return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Huỷ đơn hàng thất bại!', success: false });
            }
          }
        });

        return res.status(HTTP_STATUS.OK).json({ message: 'Hủy đơn hàng thành công!', success: true });
      }
    }
  },
};

// date: dayjs, moment, date-fns
// tìm kiếm đơn hàng dựa vào startDate, endDate & email
// dd/mm/yy => 12/06/23
// dd/mm/yyyy => 12/06/2023
// yyyy/mm/dd => 2023/06/12
// mm/dd/yyyy => 06/12/2023

// người dùng gửi lên startDate, endDate: 12/06/2023 -> 15/06/2023, 06/12/2023
// const startDate = dayjs('12/06/2023).toDate()
// const endDate = dayjs('15/06/2023).toDate()
// mongoose => $gte: startDate, $lte: endDate
// const newOrder = await Order.find({
//  createdAt: {
//    $gte: startDate,
//   $lte: endDate
// }
// })
