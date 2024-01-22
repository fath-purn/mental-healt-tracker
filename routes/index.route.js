const router = require('express').Router();

router.use('/user', require('./user.route'));
router.use('/taggar', require('./taggar.route'));
router.use('/artikel', require('./artikel.route'));
router.use('/mood', require('./mood.route'));

module.exports = router;
