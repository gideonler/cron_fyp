const mongoose = require("mongoose");

//Schema
const UserSchema =  new mongoose.Schema(
  {
    // unique_id: Number,
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    password: {
      type:String
    },
    subscribe: {
      type: Boolean
    }
  },
);

const User = mongoose.model('User', UserSchema);
module.exports = User;