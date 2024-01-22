const Joi = require('joi');

// Skema validasi untuk pengguna
const registerValidationSchema = Joi.object({
  nama: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  no_hp: Joi.string().required(),
  username: Joi.string().required(),
  password_confirmation: Joi.string().min(6).required(),
  
});

const registerAdminValidationSchema = Joi.object({
  user_admin: Joi.string().required(),
  email: Joi.string().email().required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerValidationSchema,
  loginUserSchema,
  registerAdminValidationSchema,
};
