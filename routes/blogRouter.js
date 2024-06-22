const express =require("express")
const blogController=require("../controllers/blogController")
const {authenticated}=require("../middlewares/auth")
const router=express.Router()
router.get("/all",blogController.showAllBlogs);
router.post("/create",authenticated,blogController.createBlog)
router.put("/edit/:id",authenticated,blogController.editBlog)
router.get("/",authenticated,blogController.showBlogByauthor)
router.get("/post/:id",authenticated,blogController.singleBlog)
router.delete("/delete/:id",authenticated,blogController.deleteBlog)

module.exports=router 