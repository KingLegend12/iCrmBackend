const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");
const { getAdminById } = require("../module/admin/Admin.model");
const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  //1- verify if jwt is valid
  const decoded = await verifyAccessJWT(authorization);

  if (decoded.email) {
    const userID = await getJWT(authorization);

    if (!userID) {
      return res.status(403).json({ message: "forbidden" });
    }
    req.userID = userID;
    return next();
  }
  deleteJWT(authorization);
  //2- check if jwt exits in redis

  //3- extract user id
  //4- get user profile based on the id
};

const adminAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  console.log(authorization);
  //1- verify if jwt is valid
  const decoded = await verifyAccessJWT(authorization);

  if (decoded.email) {
    const adminID = await getJWT(authorization);
    const AdminType = await getAdminById(adminID);

    if (!adminID) {
      return res.status(403).json({ message: "forbidden" });
    }
    req.AdminType = AdminType.speciality;
    req.AdminJob = AdminType.etape;
    req.adminID = adminID;
    return next();
  }
  deleteJWT(authorization);
  //2- check if jwt exits in redis

  //3- extract user id
  //4- get user profile based on the id
};

module.exports = { userAuthorization, adminAuthorization };
