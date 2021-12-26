const express = require("express");
const router = express.Router();
const {
  insertTicket,
  getTickets,
  getTicketById,
  getTicketByIdForAdmin,
  updateClientReply,
  updateStatusClose,
  updateStatusClosure,
  updateStatusTreatment,
  deleteTicket,
  getLowPriorityTickets,
  getHighPriorityTickets,
  getMedPriorityTickets,
  getTicketsForAdmin,
  updateStatusFinalClose,
} = require("../module/ticket/Ticket.model");
const { emailProcessor } = require("../helpers/email.helper");
const {
  userAuthorization,
  adminAuthorization,
} = require("../middleware/auth.middleware");
const {
  createNewTicketValidation,
  replyTicketMessageValidation,
  newUserValidation,
} = require("../middleware/formValidation.middleware");
const { getAdminBySpecialityAndEtape } = require("../module/admin/Admin.model");
const { getUserById } = require("../module/user/User.model");
router.all("/", (req, res, next) => {
  //res.json({ message: "response return from user router" });

  next();
});

router.post("/", userAuthorization, async (req, res) => {
  try {
    const { subject, sender, message, priority, speciality } = req.body;
    const userId = req.userID;
    const ticketobj = {
      clientId: userId,
      subject,
      priority,
      speciality,
      conversations: [
        {
          sender,
          message,
        },
      ],
    };
    const result = await insertTicket(ticketobj);
    console.log(result.speciality);
    const adminsToReceiveEmail = await getAdminBySpecialityAndEtape(
      result.speciality,
      "En attente de la reponse de l'operateur"
    );
    let emailslist = adminsToReceiveEmail.map((a) => a.email);
    console.log(emailslist);
    await emailProcessor({
      email: emailslist,
      type: "new-ticket-available",
    });
    if (result._id) {
      return res.json({
        status: "success",
        message: "New ticket has been created!",
      });
    }
    res.json({
      status: "error",
      message: "Unable to create the ticket , please try again later",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Get all tickets for a specific user
router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userID;
    const result = await getTickets(userId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
// Get all tickets for a specific admin
router.get("/AllTickets", adminAuthorization, async (req, res) => {
  try {
    const result = await getTicketsForAdmin(req.AdminType, req.AdminJob);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
// Get low priority tickets for admin
router.get("/basse", adminAuthorization, async (req, res) => {
  try {
    const result = await getLowPriorityTickets(
      "Basse",
      req.AdminType,
      req.AdminJob
    );
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
// Get high priority tickets for admin
router.get("/elevee", adminAuthorization, async (req, res) => {
  try {
    const result = await getHighPriorityTickets(
      "Elevée",
      req.AdminType,
      req.AdminJob
    );
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
// Get medium priority tickets for admin
router.get("/moyenne", adminAuthorization, async (req, res) => {
  try {
    const result = await getMedPriorityTickets(
      "Moyenne",
      req.AdminType,
      req.AdminJob
    );
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
//get a specific ticket for a user
router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;

    const clientId = req.userID;
    const result = await getTicketById(_id, clientId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
//get a specific ticket for a admin
router.get("/admin/:_id", adminAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;

    const admintId = req.adminID;
    const result = await getTicketByIdForAdmin(_id);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
// update reply message form client
router.put(
  "/:_id",
  replyTicketMessageValidation,
  userAuthorization,
  async (req, res) => {
    try {
      const { message, sender } = req.body;
      const { _id } = req.params;
      const clientId = req.userID;

      const result = await updateClientReply({ _id, message, sender });

      if (result._id) {
        return res.json({
          status: "success",
          message: "your message updated",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update your message please try again later",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// update reply message from admin
router.put(
  "/admin/:_id",
  replyTicketMessageValidation,
  adminAuthorization,
  async (req, res) => {
    try {
      const { message, sender } = req.body;
      const { _id } = req.params;

      const result = await updateClientReply({ _id, message, sender });
      const adminsToReceiveEmail = await getAdminBySpecialityAndEtape(
        result.speciality,
        "En attente de la reponse de l'operateur"
      );
      await emailProcessor({
        email: adminsToReceiveEmail.email,
        type: "new-ticket-available",
      });
      if (result._id) {
        return res.json({
          status: "success",
          message: "your message updated",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update your message please try again later",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// update ticket status to close
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userID;

    const result = await updateStatusClose({ _id, clientId });

    if (result._id) {
      return res.json({
        status: "success",
        message: "The ticket has been closed",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update the ticket",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// update ticket status to be treated
router.patch("/treat-ticket/:_id", adminAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;

    const result = await updateStatusTreatment({ _id });

    const clientID = await getUserById(result.clientId);
    if (result._id) {
      await emailProcessor({
        email: clientID.email,
        type: "ticket-getting-treated",
      });
      return res.json({
        status: "success",
        message: "The ticket is in treatment",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update the ticket",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// update ticket status to in closure
router.patch(
  "/admin_close-ticket/:_id",
  adminAuthorization,
  async (req, res) => {
    try {
      const { _id } = req.params;

      const result = await updateStatusClosure({ _id });
      const clientID = await getUserById(result.clientId);
      if (result._id) {
        await emailProcessor({
          email: clientID.email,
          type: "ticket-getting-closed",
        });
        return res.json({
          status: "success",
          message: "The ticket is closed",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update the ticket",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// update ticket status to in closure
router.patch(
  "/admin_FinalClose-ticket/:_id",
  adminAuthorization,
  async (req, res) => {
    try {
      const { _id } = req.params;

      const result = await updateStatusFinalClose({ _id });
      const clientID = await getUserById(result.clientId);
      if (result._id) {
        await emailProcessor({
          email: clientID.email,
          type: "ticket-closed",
        });
        return res.json({
          status: "success",
          message: "The ticket is closed",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update the ticket",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// Delete a ticket
router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userID;

    const result = await deleteTicket({ _id, clientId });

    return res.json({
      status: "success",
      message: "The ticket has been deleted",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
