const router = require("express").Router();
const {
    create,
    update,
    getById,
    getAll,
    deleteTaggar,
} = require("../controllers/taggar.controller");
const {
  checkAdmin,
} = require("../controllers/user.controller");
const verifyToken = require("../libs/verifyToken");
const { upload } = require("../libs/multer");

router.post("/add", verifyToken, checkAdmin, create);
router.put("/update/:id", verifyToken, checkAdmin, update);
router.get('/:id', verifyToken, checkAdmin, getById);
router.get('/', verifyToken, checkAdmin, getAll);
router.delete('/delete/:id', verifyToken, checkAdmin, deleteTaggar);

module.exports = router;
