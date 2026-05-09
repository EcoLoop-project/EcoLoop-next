import mongoose from 'mongoose';

const advSchema = new mongoose.Schema({
  type: { type: String, required: true },
  quantity: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'متاح' },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorPhone: { type: String, required: true },
  collectorId: { type: String },
  collectorName: { type: String },
  collectorPhone: { type: String },
  createdAt: { type: Number, default: () => Date.now() }
});

export default mongoose.models.adv || mongoose.model('adv', advSchema);