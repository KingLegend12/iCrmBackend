const mongose = require("mongoose");
const Schema = mongose.Schema;

const AdminSchema = new Schema({
  name: { type: String, maxlength: 50, required: true },
  company: { type: String, default: "ONEE" },
  address: { type: String, maxlength: 100 },
  speciality: {
    type: String,
    maxlength: 50,
    default: "General",
    required: true,
  },
  etape: {
    type: String,
    maxlength: 50,
    default: "En attente de la reponse de l'operateur",
    required: true,
  },
  phone: { type: Number, maxlength: 10 },
  email: { type: String, maxlength: 50, required: true },
  password: { type: String, minlength: 8, maxlength: 100, required: true },
  refreshJWT: {
    token: {
      type: String,
      maxlength: 500,
      default: "",
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
});

module.exports = {
  AdminSchema: mongose.model("Admin", AdminSchema),
};
