const express = require('express');
const router = express.Router();
const moment = require('moment');
const { sortObject } = require('../../helpers/sortObject');
const { verifyToken } = require('../../middlewares/middlewaresController');

router.post('/createPayment', verifyToken, function (req, res, next) {
  try {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    const newData = {
      package_id: req.body.packId,
      post_id: req.body.postId,
      userId: req?.user?.id,
    };
    req.session.payment_info = newData;
    let ipAddr = req.headers['x-forwarded-for'];
    let tmnCode = 'V7WYOOE8';
    let secretKey = 'NNFFYZKDXVIGLFRGDNHLWBBVPTZRNMYX';
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    // trả về router mình lấy link xử lí
    let returnUrl = 'https://puce-determined-raven.cyclic.app/payment/vnpay_return';
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = 'NCB';

    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    // vnp_Params['vnp_SecureHash'] = '';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD: ' + orderId;
    //   vnp_Params["vnp_OrderType"] = "billpayment";
    // vnp_Params['userId'] = userId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_BankCode'] = bankCode;

    vnp_Params = sortObject(vnp_Params);
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require('crypto');
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    console.log('vnpUrl', vnpUrl);
    res.json({
      success: true,
      vnpUrl,
    });
    // res.redirect(vnpUrl);
  } catch (error) {
    console.log('có lỗi : ', error);
  }
});

module.exports = router;
