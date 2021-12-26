const { AdminSchema } = require("./Admin.schema");
const { UserSchema } = require("../user/User.schema");

//in this JS file we put the functions we'd like to perform
const insertAdmin = (userObj) => {
  return new Promise((resolve, reject) => {
    AdminSchema(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
const getAdminByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (!email) return false;
    try {
      AdminSchema.findOne({ email }, (error, data) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getAdminBySpecialityAndEtape = (adminspeciality, adminetape) => {
  return new Promise((resolve, reject) => {
    try {
      AdminSchema.find({ speciality: adminspeciality, etape: adminetape })
        .then((email) => resolve(email))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};
const getAdminById = (_id) => {
  return new Promise((resolve, reject) => {
    if (!_id) return false;
    try {
      AdminSchema.findOne({ _id }, (error, data) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const updatePassword = (email, newhashedPassword) => {
  return new Promise((resolve, reject) => {
    try {
      AdminSchema.findOneAndUpdate(
        { email },
        {
          $set: {
            password: newhashedPassword,
          },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const storeAdminRefreshJWT = (_id, token) => {
  return new Promise((resolve, reject) => {
    try {
      AdminSchema.findOneAndUpdate(
        { _id },
        {
          $set: { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now() },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.find({ isVerified: true })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};
const verifyAdmin = (_id, email) => {
  return new Promise((resolve, reject) => {
    try {
      AdminSchema.findOneAndUpdate(
        { _id, email, isVerified: false },
        {
          $set: { isVerified: true },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => {
          console.log(error.message);
          reject(error);
        });
    } catch (error) {
      console.log(error.message);
      reject(error);
    }
  });
};
module.exports = {
  insertAdmin,
  getAdminByEmail,
  storeAdminRefreshJWT,
  getAdminById,
  updatePassword,
  verifyAdmin,
  getAllUsers,
  getAdminBySpecialityAndEtape,
};
