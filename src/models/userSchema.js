//user
//user
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type: String,required: true},
  email: {type: String,required: true,unique: true},
  password: {type: String,required: true},
  phone: {type: Number,required:true},
  location: {address: String},
  role: {type: String,enum: ["user", "admin"],default: "user"},
  points: {type: Number,default: 0},
  wasteQuantity: {type: Number,required: true,min: 0},

wasteCategory: {type: String,required: true, enum: ["Plastic", "Paper", "Glass", "Metal", "Electronic", "Organic", "Other"],
},

  recyclingRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adv",
    },
  ],

}, { timestamps: true });

export default mongoose.model("user", userSchema);