const mongoose = require('mongoose');
const multer = require('multer'); 
const path = require('path');
const db = require('../config/mongoose');
const AVATAR_PATH  = path.join('/uploads/users/avatars')
const crypto = require('crypto');
// for passreset
const bcrypt = require('bcrypt');
const bcryptSalt = process.env.BCRYPT_SALT;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    resetPasswordToken :{
        type : String,
        required : false
      
    },
    resetPasswordExpires :{
        type: Date,
        required: false

        
    },
   
    avatar :{
        type : String
    },
}, {
    timestamps: true
});
// for passReset
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//       return next();
//     }
//     const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
//     this.password = hash;
//     next();
//   });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
    }
  });
  userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
  userSchema.statics.avatarPath = AVATAR_PATH;


//   for passreset
userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
const User = mongoose.model('User', userSchema);

module.exports = User;