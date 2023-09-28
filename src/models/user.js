const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  avatar: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    minlength: 3,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
  role: {
    type: String,
    enum: ['admin', 'user', 'mod'],
    default: 'user',
  },
  packages: {
    type: [
      {
        package_id: { type: Schema.Types.ObjectId, ref: 'Package' },
      },
    ],
    default: [],
  },
  vip_package: {
    type: String,
    enum: ['vip0', 'vip1', 'vip2', 'vip3'],
    default: 'vip0',
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods = {
  isValidPassword: async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw error;
    }
  },
  createChangePasswordToken() {
    const key = '2wpowcczxcxznnmjdeaior@@@##';

    const passwordResetExpires = Date.now() + 5 * 60 * 1000;
    const passwordReset = crypto
      .createHash('shake256', { outputLength: 20 })
      .update(key)
      .digest('hex');
    this.resetPasswordToken = passwordReset;
    this.resetPasswordExpires = passwordResetExpires;
    return {
      passwordReset,
      passwordResetExpires,
    };
  },
};

module.exports = mongoose.model('Users', userSchema);
