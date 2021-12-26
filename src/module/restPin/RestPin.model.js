const { randomPinGenerator } = require("../../utils/randomPinGenerator");
const { ResetPinSchema } = require("./RestPin.schema");
//in this JS file we put the functions we'd like to perform
const setPinResetPass = async (email) => {
  const pinlength = 6;
  const randomPin = await randomPinGenerator(pinlength);
  const resetObj = {
    email,
    pin: randomPin,
  };
  return new Promise((resolve, reject) => {
    ResetPinSchema(resetObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
const getPinByEmailPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOne({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
          resolve(false);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
const deletePin = (email, pin) => {
  try {
    ResetPinSchema.findOneAndDelete({ email, pin }, (error, data) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    reject(error);
    console.log(error);
  }
};

module.exports = {
  setPinResetPass,
  getPinByEmailPin,
  deletePin,
};
