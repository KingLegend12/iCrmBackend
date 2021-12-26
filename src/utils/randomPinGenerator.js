const randomPinGenerator = (length) => {
  let pin = "";
  for (let index = 0; index < length; index++) {
    pin += Math.floor(Math.random() * 10);
  }
  return pin;
};

module.exports = {
  randomPinGenerator,
};
