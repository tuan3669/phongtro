const mongoose = require('mongoose');
const { Schema } = mongoose;
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    images: {
      type: Array,
    },
    filenameList: {
      type: Array,
    },
    phone: {
      type: String,
    },
    isvip: {
      type: String,
      default: 'vip0',
      enum: ['vip0', 'vip1', 'vip2', 'vip3'],
    },
    package_id: { type: Schema.Types.ObjectId, ref: 'Package' },
    acreage: {
      type: Number,
    },
    expired_at: {
      type: Date,
      default: null,
    },
    category_id: { type: Schema.Types.ObjectId, ref: 'Categories' },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Posts', postSchema);
