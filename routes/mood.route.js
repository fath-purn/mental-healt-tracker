const router = require("express").Router();
const {
    create,
    update,
    getById,
    getAll,
    deleteMood,
    getAllTotal,
    getMonthlyMoodPercentage,
    getDailyMoodPerUser,
} = require("../controllers/mood.controller");
const {
  checkAdmin,
} = require("../controllers/user.controller");
const verifyToken = require("../libs/verifyToken");
const { upload } = require("../libs/multer");

router.post("/add", verifyToken, checkAdmin, create);
router.put("/update/:id", verifyToken, checkAdmin, update);
router.delete('/delete/:id', verifyToken, checkAdmin, deleteMood);
router.get('/total', verifyToken, getAllTotal);
router.get('/persentase-mood', verifyToken, getMonthlyMoodPercentage);
router.get('/mood-today', verifyToken, getDailyMoodPerUser);
router.get('/:id', verifyToken, checkAdmin, getById);
router.get('/', verifyToken, checkAdmin, getAll);

module.exports = router;
