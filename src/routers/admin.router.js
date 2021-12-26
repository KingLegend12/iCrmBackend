const express = require("express");
const router = express.Router();
const { hashedPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { deleteJWT } = require("../helpers/redis.helper");
const { verify } = require("jsonwebtoken");

const verificationURL = "https://devagileicrm.herokuapp.com/verification/";
const {
  resetPassReqValidation,
  newAdminValidation,
} = require("../middleware/formValidation.middleware");
const {
  insertAdmin,
  getAdminByEmail,
  storeAdminRefreshJWT,
  getAdminById,
  updatePassword,
  verifyAdmin,
  getAllUsers,
} = require("../module/admin/Admin.model");
const { adminAuthorization } = require("../middleware/auth.middleware");
const {
  setPinResetPass,
  getPinByEmailPin,
  deletePin,
} = require("../module/restPin/RestPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const { insertAdminEmail } = require("../module/emails/adminEmail1.model");
const { getUserById } = require("../module/user/User.model");
router.all("/", (req, res, next) => {
  //res.json({ message: "response return from user router" });
  next();
});
//get admin profile profile
router.get("/", adminAuthorization, async (req, res) => {
  const _id = req.adminID;

  const adminProfile = await getAdminById(_id);
  //res.json({ user: req.userID });
  res.json({ admin: adminProfile });
});
//fetch all users route
router.get("/allUsers", adminAuthorization, async (req, res) => {
  try {
    const result = await getAllUsers();

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

router.get("/client/:_id", adminAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await getUserById(_id);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
///very user after user is sign up
router.patch("/verify", async (req, res) => {
  try {
    const { _id, email } = req.body;
    console.log(_id, email);

    const result = await verifyAdmin(_id, email);

    if (result && result.id) {
      return res.json({
        status: "success",
        message: "Votre compte a éte activer ! vous pouvez vous connecter ",
      });
    }

    return res.json({
      status: "error",
      message: "Invalid request!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "Invalid request!",
    });
  }
});

router.post("/", newAdminValidation, async (req, res) => {
  const {
    name,
    company,
    address,
    speciality,
    etape,
    phone,
    email,
    password,
  } = req.body;
  try {
    const hashedPass = await hashedPassword(password);
    const newAdminObject = {
      name,
      company,
      address,
      speciality,
      etape,
      phone,
      email,
      password: hashedPass,
    };
    const newEmailObject = {
      email,
    };
    const result = await insertAdmin(newAdminObject);
    await insertAdminEmail(newEmailObject);
    console.log(result);
    //send confirmation email
    /* await emailProcessor({
      email,
      type: "new-user-confirmation-required",
      verificationLink: verificationURL + result._id + "/" + email,
    });  */

    res.json({ message: "new admin created", result });
  } catch (error) {
    console.log(error);

    let message =
      "On n'a pas pu creé votre compte pour le moment, Veuillez reesayer ou contacter l'administration";
    if (error.message.includes("duplicate key error collection")) {
      message = "ce email a dejà un compte ! ";
    }
    res.json({ status: "error", message });
  }
});

// User sign in router
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  //get user with email from the database
  //hash the password and compare with the database

  if (!email || !password) {
    res.json({ status: "error", message: "invalid Form submission" });
  }

  //get the admin by email from the database
  const admin = await getAdminByEmail(email);
  console.log(admin);
  if (!admin.isVerified) {
    res.json({ status: "error", message: "Veuillez verifier ce compte" });
  }
  const passFromDb = admin && admin._id ? admin.password : null;
  // if there is no password in the database we throw an error
  if (!passFromDb) {
    return res.json({
      status: "error",
      message: "Email or password is invalid",
    });
  }
  // wait for the compararison result
  const result = await comparePassword(password, passFromDb);
  // if the passwords match then success
  console.log(result);
  if (result == true) {
    const accessJWT = await createAccessJWT(admin.email, `${admin._id}`);
    const refreshJWT = await createRefreshJWT(admin.email, `${admin._id}`);

    res.json({
      status: "success",
      message: "log in success",
      accessJWT,
      refreshJWT,
    });
  } else if (result == false) {
    // if the passwords don't match throw error
    res.json({ status: "error", message: "one of the credentials is wrong" });
  }
});
{
  /*  to reset the password we need:
  1-receice the email done
  2-check if the user email exists done
  3-generate a pin number  done 
  4-save the pin and the email to the database done
  4-send the pin to the email done

  to update the password to the database
  1-receive email pin and new password
  2-check if the pin is valid
  3-encrypt the password
  4-update the password to the database
  5-send email notification
  */
}
router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;
  const admin = await getAdminByEmail(email);
  if (!admin && !admin._id) {
    res.json({
      status: "error",
      message:
        "if this email exists in our database, a reset pin will be sent shortly",
    });
  }
  if (admin && admin._id) {
    const setPin = await setPinResetPass(email);
    const result = await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-password",
    });

    if (result && result.messageId) {
      return res.json({
        status: "succes",
        message:
          "if this email exists in our database, a reset pin will be sent shortly",
      });
    }
    return res.json({
      status: "error",
      message:
        "if this email exists in our database, a reset pin will be sent shortly",
    });
  }
});

router.patch("/reset-password", async (req, res) => {
  const { email, pin, newPassword } = req.body;
  const getPin = await getPinByEmailPin(email, pin);

  if (getPin._id) {
    const DbDate = getPin.addedAt;
    const expiresIn = 1;
    let expireDate = DbDate.setDate(DbDate.getDate() + expiresIn);
    const today = new Date();
    if (today > expireDate) {
      return res.json({ status: "error", message: "Invalid Expired Pin" });
    }

    //encrypt new password
    const hashNewPass = await hashedPassword(newPassword);
    //get new updated db
    const admin = await updatePassword(
      email,
      hashNewPass,
      "request-new-password"
    );

    if (admin._id) {
      //send email to customer
      await emailProcessor({ email, type: "password-update-success" });
      deletePin(email, pin);
      return res.json({
        status: "success",
        message: "your password have been updated",
      });
    }
    return res.json({
      status: "error",
      message: "Unable to update password",
    });
  }
  res.json(result);
});
//user log out end point
router.delete("/logout", adminAuthorization, async (req, res) => {
  const { authorization } = req.headers;

  const _id = req.adminID;
  deleteJWT(authorization);
  const result = await storeAdminRefreshJWT(_id, "");
  if (result._id) {
    return res.json({ status: "success", message: "logged out succesfully" });
  }
  res.json({
    status: "error",
    message: "unable to log you out please try later",
  });
});

module.exports = router;
