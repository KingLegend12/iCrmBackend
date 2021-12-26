const jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("../helpers/redis.helper");
const { storeUserRefreshJWT } = require("../module/user/User.model");
const createAccessJWT = async (email, _id) => {
  try {
    const accessJWT = await jwt.sign({ email }, process.env.JWT_ACCESS_kEY, {
      expiresIn: "1h",
    });
    await setJWT(accessJWT, _id);
    return Promise.resolve(accessJWT);
  } catch (error) {
    return Promise.reject(accessJWT);
  }
};
const createRefreshJWT = async (email, _id) => {
  try {
    const refreshJWT = await jwt.sign({ email }, process.env.JWT_REFRESH_kEY, {
      expiresIn: "30d",
    });
    await storeUserRefreshJWT(_id, refreshJWT);
    return Promise.resolve(refreshJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};
const verifyAccessJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_kEY));
  } catch (error) {
    return Promise.reject(error);
  }
};
const verifyRefreshJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_kEY));
  } catch (error) {
    return Promise.reject(error);
  }
};
module.exports = {
  createAccessJWT,
  createRefreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
};
