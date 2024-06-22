const RefreshToken=require("../models/refreshTokenModel")
const {createError}=require("./errors")
const jwt=require("jsonwebtoken")



exports.authenticated = async (req, res, next) => {
    try {
      
  
      const deviceIdentifier = await req.headers.deviceidentifier;
      const authHeader = await req.get("Authorization");
  
      if (!authHeader) {
        throw createError(
          401,
          "No authorization token provided",
          "no permission to access the resource"
        );
      }
  
      const token = authHeader.substring(7); // remove Bearer prefix from token
      const decodedToken = jwt.decode(token);
  
      if (!decodedToken) throw createError(401, "", "token is not valid");
  
      req.userId = decodedToken.user.userId;
  
      const isUserLoggedIn = await RefreshToken.findOne({ deviceIdentifier });
  
      if (!isUserLoggedIn) {
        throw createError(401, "", "login again");
      }
  
      if (decodedToken.usage === "auth-access") {
        const finalDecodedToken = jwt.verify(token, process.env.JWT_SECRET);
  
        if (!finalDecodedToken) {
          throw createError(401, "", "send refresh token");
        }
  
       
  
        next();
      } else {
        throw createError(401, "", "token is not valid");
      }
    } catch (err) {
      if (err.message === "jwt expired") {
        next(createError(401, "", "send refresh token"));
      }
      next(err);
    }
  };
  
