const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "gsom7dgv2o23s2ql@ethereal.email",
    pass: "UeYBdgWNgz28jQf2FA",
  },
});

const pinSender = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      resolve(result);
    } catch (error) {
      console.log("error");
    }
  });
};

const emailProcessor = ({ email, pin, type, verificationLink = "" }) => {
  let info = "";
  switch (type) {
    case "request-new-password":
      info = {
        from: '"KING LEGEND postgreSQL" <helen5@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password Reset Pin", // Subject line
        text:
          "Here is your password reset pin " +
          pin +
          " this pin will expire NOW your account is hacked !", // plain text body
        html: `<b>Hello world?</b>
    Here is your pin
    <b>${pin} </b>
    This will expire in one day
    <p></p>
    `, // html body
      };
      pinSender(info);
      break;
    case "password-update-success":
      info = {
        from: '"KING LEGEND" <helen5@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password updated", // Subject line
        text: "your password have been updated ", // plain text body
        html: `<b>Hello</b>
   
    <p>your password has been updated </p>
    `, // html body
      };
      pinSender(info);
      break;
    case "new-user-confirmation-required":
      info = {
        from: '"ONEE" <helen5@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Veuillez confimer", // Subject line
        text:
          "Veuillez cliquez ce lien pour confirmer votre compte et y acceder", // plain text body
        html: `<b>Hello </b>
        <p>Please follow the link to very your account before you can login</p>
        <p>${verificationLink}</P>
        `, // html body
      };

      pinSender(info);
      break;
    case "new-ticket-available":
      info = {
        from: '"ONEE" <helen5@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Nouveau Ticket à traiter", // Subject line
        text: "Un nouveau ticket a eté ajouté", // plain text body
        html: `<b>Bonkour </b>
        <p>Un nouveau ticket a eté ajouté</p>
        
        `, // html body
      };
      pinSender(info);
      break;

    case "ticket-getting-treated":
      info = {
        from: '"ONEE" <AdminBot@onee.ma>', // sender address
        to: email, // list of receivers
        subject: "Ticket En traitement", // Subject line
        text: "Votre ticket est en traitement, merci de votre cooperation", // plain text body
        html: `<b>Bonjour </b>
        <p>votre ticket est en traitement</p>
        `,
      };
      pinSender(info);
      break;

    case "ticket-getting-closed":
      info = {
        from: '"ONEE" <AdminBot@onee.ma>', // sender address
        to: email, // list of receivers
        subject: "Ticket En traitement", // Subject line
        text:
          "Votre ticket est en fermeture, Veuillez confirmez la fermeture de votre coté, si la fermeture n'est pas confirmé apres 3jours le systeme ferme le ticket automatiquement", // plain text body
        html: `<b>Bonjour </b>
        <p>Votre ticket est en fermeture, Veuillez confirmez la fermeture de votre coté,</p>
        
        `,
      };
      pinSender(info);
      break;

    default:
      break;
  }
};

module.exports = {
  emailProcessor,
};
