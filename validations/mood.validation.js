const Joi = require('joi');

// Skema validasi untuk pengguna
const moodValidationSchema = Joi.object({
    mood_today: Joi.string().valid("HAPPY", "NEUTRAL", "SAD",).required(),
});

module.exports = {
    moodValidationSchema,
};
