const router = require("express").Router();
const {
  register,
  login,
  authenticate,
  getAll,
  registerAdmin,
  checkAdmin,
  updateValidasi,
  updateProfileImage,
} = require("../controllers/user.controller");
const verifyToken = require("../libs/verifyToken");
const { upload } = require("../libs/multer");

router.post("/register", register);
router.post("/login", login);
router.get('/', verifyToken, checkAdmin, getAll);
router.get("/whoami", verifyToken, authenticate);

router.put("/update-validasi/:id", verifyToken, checkAdmin, updateValidasi);
router.put("/update-image-profile", upload.single('image'), verifyToken, updateProfileImage);

router.post("/registeradmin", registerAdmin);

module.exports = router;
