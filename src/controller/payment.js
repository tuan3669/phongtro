const Payment = require('../models/payment');
const Post = require('../models/posts');
const Package = require('../models/package');
const { sortObject } = require('../helpers/sortObject');
// const updateExpiredPost = require('../helpers/updatedExpriedPost');

const list = async (req, res, next) => {
  res.render('./admin/payment/index', { title: 'Payment' });
};

const vnpay_return = async (req, res, next) => {
  let vnp_Params = req.query;
  console.log('vnpay_renturn 2 ', req.session.payment_info);

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = 'NNFFYZKDXVIGLFRGDNHLWBBVPTZRNMYX';

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    try {
      const { package_id, post_id, userId } = req.session.payment_info;
      // inset to post
      const post = await Post.findOne({ _id: post_id });
      const pack = await Package.findOne({ _id: package_id });

      //  gói Vippp tuong ứng với số tiền thanh toán
      // 'vip1', 'vip2', 'vip3'

      // Cap nhatt trường expired_at của bài post :
      const currentDate = new Date();
      let expiredDate;
      switch (pack.name) {
        case 'vip1':
          // xét 1 phút
          expiredDate = new Date(currentDate.getTime() + 1 * 800);
          break;
        case 'vip2':
          expiredDate = new Date(currentDate.getTime() + pack.duration * 24 * 60 * 60 * 1000);
          break;
        case 'vip3':
          expiredDate = new Date(currentDate.getTime() + pack.duration * 24 * 60 * 60 * 1000);
          break;
        default:
          expiredDate = null;
      }
      post.expired_at = expiredDate;
      post.isvip = pack.name;
      post.package_id = package_id;
      // Lưu lại thông tin cập nhật của bài post
      await post.save();

      delete req.session.payment_info;
      const payment = new Payment({
        package_id,
        user_id: userId,
        amount: vnp_Params['vnp_Amount'],
        payment_info: vnp_Params['vnp_OrderInfo'],
        transaction_id: vnp_Params['vnp_TxnRef'],
        status: 'success',
      });
      await payment.save();

      // xử lí thời hạn post sau khi mua vip
      // await updateExpiredPost();

      res.render('./admin/payment/vnpay-return', {
        title: 'VNPAY RETURN',
        code: vnp_Params['vnp_ResponseCode'],
      });
    } catch (error) {
      console.log('error', error);
      res.render('./admin/payment/vnpay-return', { title: 'VNPAY RETURN', code: 97 });
    }
  } else {
    res.render('./admin/payment/vnpay-return', { title: 'VNPAY RETURN', code: 97 });
  }
};

module.exports = { list, vnpay_return };
