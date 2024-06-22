const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const schemas= require("../validations/userValidations")

const userSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    posts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blog",
          default: [],
        },
      ],
      
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    // Set User Validation in Statics
userSchema.statics.userValidation = function (body) {
    return schemas.registerUserScheme.validate(body, { abortEarly: false });
  };
  userSchema.pre("save", function (next) {
    let user = this;
    if (!user.isModified("password")) {
      return next();
    }
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
  
  const User = mongoose.model("User", userSchema);
  
  module.exports = User;