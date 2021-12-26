const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId },
  subject: { type: String, maxlength: 100, required: true, default: "Problem" },
  openAt: { type: Date, required: true, default: Date.now() },
  status: {
    type: String,
    maxlength: 60,
    required: true,
    default: "En attente de la reponse de l'operateur",
  },
  priority: { type: String, maxlength: 10, required: true, default: "Moyenne" },
  speciality: {
    type: String,
    maxlength: 50,

    required: true,
  },
  conversations: [
    {
      sender: {
        type: String,
        maxlength: 100,

        default: "User1",
        required: true,
      },
      message: {
        type: String,
        maxlength: 1000,
        required: true,
        default: "En attente de la reponse de l'operateur",
      },
      msgAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
  ],
});

module.exports = {
  TicketSchema: mongoose.model("Ticket", TicketSchema),
};
