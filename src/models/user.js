const mongoose = require("mongoose");

//Create the user schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  confirmedEmail: {
    type: Boolean,
    default: false,
  },
  confirmPasswordToken: String,
  confirmPasswordExpires: Date,
});
//Create, instantiate and export model with schema
const Users = mongoose.model("users", UserSchema);

export default Users;
