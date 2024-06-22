const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const { createError } = require("../middlewares/errors");
const RefreshToken = require("../models/refreshTokenModel");
const ms = require("ms");

const User = require("../models/userModel");
const client = redis.createClient();

// registration
exports.signup = async (fullname, email, password, confirmPassword) => {
  await User.userValidation({ fullname, email, password, confirmPassword });

  const user = await User.findOne({ email });
  if (user) {
    throw createError(422, "", "email is already registered");
  }

  await User.create({
    fullname,
    email,
    password,
  });

  return true;
};

//login
// will add remember me for future
exports.login = async (email, password, rememberMe, deviceIdentifier) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "", "no user found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw createError(422, "", "wrong password");
  }

  const accessToken = jwt.sign(
    {
      user: {
        userId: user._id.toString(),
        email: user.email,
        fullname: user.fullname,
      },
      usage: "auth-access",
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  const isRefreshTokenAlreadyCreated = await RefreshToken.findOne({
    deviceIdentifier,
  });

  let theRefreshToken;

  if (!isRefreshTokenAlreadyCreated) {
    const refreshTokenExpiresIn = rememberMe ? "15d" : "1d";
    const expiresInMs = ms(refreshTokenExpiresIn);
    const refreshTokenExpirationTime = Date.now() + expiresInMs;

    const refreshToken = jwt.sign(
      {
        user: {
          userId: user._id.toString(),
          email: user.email,
          fullname: user.fullname,
        },
        usage: "auth-refresh",
      },
      process.env.JWT_SECRET,
      { expiresIn: refreshTokenExpiresIn }
    );

    theRefreshToken = refreshToken;

    await RefreshToken.create({
      token: refreshToken,
      user: user._id.toString(),
      expiresAt: new Date(refreshTokenExpirationTime),
      deviceIdentifier,
    });
  }

  return {
    accessToken: accessToken,
    refreshToken: theRefreshToken,
    userId: user._id.toString(),
  };
};
