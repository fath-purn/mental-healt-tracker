const Joi = require('joi');

// Skema validasi untuk pengguna
const artikelValidationSchema = Joi.object({
  judul: Joi.string().required(),
  deskripsi: Joi.string().required(),
  id_taggar: Joi.number().required(),
});

const artikelUpdateValidationSchema = Joi.object({
  judul: Joi.string(),
  deskripsi: Joi.string(),
  id_taggar: Joi.number(),
});

module.exports = {
    artikelValidationSchema,
    artikelUpdateValidationSchema,
};
