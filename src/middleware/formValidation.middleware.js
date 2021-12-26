const Joi = require("joi");

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net", "ma"] },
});
const pin = Joi.string().min(100000).max(999999).required();
const phone = Joi.number().min(232).max(232).required();
const newPassword = Joi.string().alphanum().min(8).max(30).required();

const shortStr = Joi.string().min(2).max(60);
const longStr = Joi.string().min(2).max(1000);
const dt = Joi.date();

const resetPassReqValidation = (req, res, next) => {
  const schema = Joi.object({ email });
  const value = schema.validate(req.body);

  if (value.error) {
    res.json({
      status: "error",
      message: value.error.message,
    });
  }
  next();
};
const updatePassReqValidation = (req, res, next) => {
  const schema = Joi.object({ email, pin, newPassword });
  const value = schema.validate(req.body);

  if (value.error) {
    res.json({
      status: "error",
      message: value.error.message,
    });
  }
  next();
};

const createNewTicketValidation = (req, res, next) => {
  const schema = Joi.object({
    subject: shortStr.required(),
    sender: shortStr.required(),
    message: longStr.required(),
    issueDate: dt.required(),
  });

  console.log(req.body);
  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};
const replyTicketMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    sender: shortStr.required(),
    message: longStr.required(),
  });

  console.log(req.body);
  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};

const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: shortStr.required(),
    company: shortStr.required(),
    address: shortStr.required(),
    phone: phone,
    email: shortStr.required(),
    password: shortStr.required(),
  });

  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};
const newAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    name: shortStr.required(),
    company: shortStr.required(),
    address: shortStr.required(),
    speciality: shortStr.required(),
    phone: phone,
    email: shortStr.required(),
    password: shortStr.required(),
    etape: shortStr.required(),
  });

  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};

module.exports = {
  resetPassReqValidation,
  updatePassReqValidation,
  createNewTicketValidation,
  replyTicketMessageValidation,
  newUserValidation,
  newAdminValidation,
};
