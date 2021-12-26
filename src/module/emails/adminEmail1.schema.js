const mongose = require("mongoose");
const Schema = mongose.Schema;
const AdminEmailSchema = new Schema({
  email: { type: String, maxlength: 50, required: true },
});

module.exports = {
  AdminEmailSchema: mongose.model("AdminsEmail", AdminEmailSchema),
};
