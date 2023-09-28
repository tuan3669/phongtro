const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  payment_info: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// paymentSchema.post('save', async function (payment) {

// });

module.exports = mongoose.model('Payment', paymentSchema);
