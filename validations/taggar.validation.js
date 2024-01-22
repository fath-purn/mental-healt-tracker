const Joi = require("joi");

// Skema validasi untuk pengguna
const taggarValidationSchema = Joi.object({
  nama: Joi.string().required(),
});

module.exports = {
  taggarValidationSchema,
};
