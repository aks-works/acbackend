const service=require("../services/userService")
const {createError} =require("../middlewares/errors")

exports.signup=async (req,res,next)=>{
    try{
        const {fullname,email,password,confirmPassword}=req.body;
        await service.signup(fullname,email,password,confirmPassword);
        res.status(201).json({message:"success"});
    } catch(err){
        next(err)
    }
}
exports.login = async (req, res, next) => {
    try {
      const deviceIdentifier = await req.headers.deviceidentifier;
      const { email, password, rememberMe } = req.body;
      const { accessToken, refreshToken, userId } = await service.login(
        email,
        password,
        rememberMe,
        deviceIdentifier
      );
      res.status(200).json({ accessToken, refreshToken, userId });
    } catch (err) {
      next(err);
    }
  };

  // exports.newAccessToken = async (req, res, next) => {
  //   try {
  //     const deviceIdentifier = await req.headers.deviceidentifier;
  //     const authHeader = await req.get("Authorization");
  //     const token = authHeader.substring(7); // remove Bearer prefix from token
  //     const accessToken = await service.newAccessToken(token, deviceIdentifier);
  //     res.status(200).json({ accessToken });
  //   } catch (err) {
  //     next(err);
  //   }
  // };
  // exports.logout = async (req, res, next) => {
  //   const deviceIdentifier = await req.headers.deviceidentifier;
  //   const userId = req.userId;
  //   const authHeader = req.get("Authorization");
  //   try {
  //     if (!authHeader) throw createError(401, "", "no token recived");
  //     const token = authHeader.split(" ")[1];
  //     await service.logout(token, deviceIdentifier, userId);
  //     res.status(200).json({ message: "done" });
  //   } catch (err) {
  //     next(err);
  //   }
  // };
  