const express= require("express")
const userController = require("../controllers/userController");
const {authenticated}=require("../middlewares/auth")
const router=express.Router()

router.post("/login",userController.login)
// router.post("/access-token", userController.newAccessToken);
router.post("/signup",userController.signup)
// router.post("/logout",authenticated,userController.logout)



module.exports=router