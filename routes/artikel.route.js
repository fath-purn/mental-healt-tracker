const router = require("express").Router();
const {
    create,
    update,
    getById,
    getAll,
    deleteArtikel,
} = require("../controllers/artikel.controller");
const {
  checkAdmin,
} = require("../controllers/user.controller");
const verifyToken = require("../libs/verifyToken");
const { upload } = require("../libs/multer");

router.post("/add", upload.single('image'), verifyToken, create);
router.put("/update/:id", upload.single('image'), verifyToken, update);
router.get('/:id', verifyToken, getById);
router.get('/', verifyToken, getAll);
router.delete('/delete/:id', verifyToken, checkAdmin, deleteArtikel);

module.exports = router;
