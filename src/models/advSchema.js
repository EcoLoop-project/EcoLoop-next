import mongoose from "mongoose";

const advSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "type of recyclable material is required"],
    enum: ["plastic", "paper", "glass", "metals", "electronics", "organic"],
  },

  quantity: {
    type: String,
    required: [true, "quantity or description is required"],
    trim: true,
  },

  address: {
    type: String,
    required: [true, "address is required"],
    trim: true,
  },

  points: {
    type: Number,
    default: 15,
    min: 0,
  },

  status: {
    type: String,
    default: "vailable",
    enum: ["vailable", "pending", "completed", "cancelled"],
  },

  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "author ID is required"],
  },

  authorName: {
    type: String,
    required: true,
  },

  authorPhone: {
    type: String,
    required: true,
  },

  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },

  collectorName: {
    type: String,
    default: null,
  },

  collectorPhone: {
    type: String,
    default: null,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

advSchema.index({ status: 1, type: 1 });
advSchema.index({ authorId: 1 });
advSchema.index({ collectorId: 1 });

advSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const adv = mongoose.models.adv || mongoose.model("adv", advSchema);

export default adv;