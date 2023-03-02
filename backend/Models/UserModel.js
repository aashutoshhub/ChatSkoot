const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique:true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  pic: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }
}, {
    timestamps:true,
}
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}


const User = mongoose.model("User", userSchema);

module.exports = User;