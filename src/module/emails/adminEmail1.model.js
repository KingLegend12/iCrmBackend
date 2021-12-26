const { AdminEmailSchema } = require("./adminEmail1.schema");

const insertAdminEmail = (userObj) => {
  return new Promise((resolve, reject) => {
    AdminEmailSchema(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

module.exports = {
  insertAdminEmail,
};
