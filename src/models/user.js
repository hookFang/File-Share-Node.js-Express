const mongoose = require("mongoose");

//Create the user schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});
//Create, instantiate and export model with schema
const Users = mongoose.model("users", UserSchema);

export default Users;
