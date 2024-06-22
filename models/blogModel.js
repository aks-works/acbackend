const mongoose=require('mongoose')
const schemas=require("../validations/blogValidations")

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlenght:100,
    },
    body:{
        type:String,
        required:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
})

blogSchema.statics.postValidation = function (body) {
    return schemas.addPostSchema.validate(body, { abortEarly: false });
  };
  
  const Blog = mongoose.model("Blog", blogSchema);

  module.exports = Blog;