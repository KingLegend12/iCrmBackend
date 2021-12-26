const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
client.on("error", function (error) {
  console.log(error);
});
const setJWT = (key, value) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err, resp) => {
      try {
        if (err) reject(err);
        resolve(resp);
      } catch (error) {
        reject(error);
      }
    });
  });
};
const getJWT = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, resp) => {
      try {
        if (err) reject(err);
        resolve(resp);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const deleteJWT = (key) => {
  try {
    client.del(key);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getJWT,
  setJWT,
  deleteJWT,
};
