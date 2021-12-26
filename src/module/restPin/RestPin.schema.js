const mongose = require("mongoose");
const Schema = mongose.Schema;

const ResetPinSchema = new Schema({
  pin: { type: String, maxlength: 6, minlength: 6 },
  email: { type: String, maxlength: 50, required: true },
  addedAt: { type: Date, required: true, default: Date.now() },
});

module.exports = {
  ResetPinSchema: mongose.model("ResetPin", ResetPinSchema),
};
