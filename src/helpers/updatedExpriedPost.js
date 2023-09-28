// const Post = require('../models/posts');
// const mongoose = require('mongoose');
// async function updateExpiredPost() {
//   try {
//     await Post.aggregate([
//       {
//         $match: {
//           expired_at: { $lt: new Date() }, // lọc các documents có trường "expried" hết hạn
//         },
//       },
//       {
//         $addFields: {
//           isvip: 'vip0', // cap nhat truong "vip" của các documents này thành giá trị vip0
//           expired_at: null, // cap nhat truong "vip" của các documents này thành giá trị vip0
//         },
//       },
//       {
//         $out: 'posts', // lưu các documents đã được cập nhật vào collection mới
//       },
//     ]).exec();
//     console.log('Update expired posts successfully ahihii .....!');
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function updateExpiredPost() {
//   try {
//     await Post.aggregate([
//       {
//         $match: {
//           expired_at: { $lt: new Date() }, // lọc các documents có trường "expired_at" hết hạn
//         },
//       },
//       {
//         $addFields: {
//           isvip: 'vip0', // cap nhat truong "isvip" của các documents này thành giá trị vip0
//           expired_at: null, // cap nhat truong "expired_at" của các documents này thành giá trị null để loại bỏ thời gian hết hạn
//         },
//       },
//       {
//         $merge: {
//           into: 'posts',
//           on: '_id',
//           whenMatched: 'replace',
//         },
//       },
//     ]).exec();
//     console.log('Update expired posts successfully ahihii .....!');
//   } catch (error) {
//     console.error(error);
//   }
// }


// module.exports = updateExpiredPost;
