const express = require("express");
const router = express.Router();
const { getUserByEmail } = require("../module/user/User.model");
const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
//return refresh jwt
router.all("/", async (req, res, next) => {
  const { authorization } = req.headers;

  //make sure token is valid
  const decoded = await verifyRefreshJWT(authorization);
  if (decoded.email) {
    //2 check if the json webtoken is existing in the database
    const userProfile = await getUserByEmail(decoded.email);
    if (userProfile._id) {
      //res.status(403).json({ message: userProfile });
      let tokenExpDate = userProfile.refreshJWT.addedAt;
      tokenExpDate = tokenExpDate.setDate(
        tokenExpDate.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
      );
      const today = new Date();
      if (tokenExpDate < today) {
        //expired date
        return res.status(403).json({ message: "Forbidden sign in again" });
      }
      const accessJWT = await createAccessJWT(
        decoded.email,
        userProfile._id.toString()
      );
      //delete old token from redis database
      return res.json({ status: "success", accessJWT });
    }
  }

  //3 check if it is not expired
  //res.json({ message: decoded });
});

module.exports = router;
