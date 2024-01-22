require("dotenv").config();
const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  registerValidationSchema,
  loginUserSchema,
} = require("../validations/user.validation");
const imagekit = require("../libs/imagekit");
const path = require("path");

function toIndonesianPhoneNumber(phoneNumber) {
  let digitsOnly = phoneNumber.replace(/\D/g, "");

  if (digitsOnly.startsWith("0")) {
    return "+62" + digitsOnly.substring(1);
  }

  if (digitsOnly.startsWith("62") || !digitsOnly.startsWith("62")) {
    return "+62" + digitsOnly;
  }

  return digitsOnly;
}

// register
const register = async (req, res, next) => {
  try {
    const { value, error } = await registerValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    let { nama, email, no_hp, username, password, password_confirmation } =
      value;

    if (password !== password_confirmation) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: "Password tidak sama",
        data: null,
      });
    }

    let userExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: "Email already exists!",
        data: null,
      });
    }
    let encryptedPassword = await bcrypt.hash(password, 10);
    let indonesianPhoneNumber = toIndonesianPhoneNumber(no_hp);

    let users = await prisma.user.create({
      data: {
        nama,
        email,
        no_hp: indonesianPhoneNumber,
        username,
        password: encryptedPassword,
      },
    });

    delete users.password;

    return res.status(201).json({
      status: true,
      message: "OK!",
      err: null,
      data: users,
    });
  } catch (err) {
    next(err);
    return res.status(404).json({
      status: true,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { value, error } = await loginUserSchema.validateAsync({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Bad Request",
        err: "User not found",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        err: "Wrong Email or Password",
        data: null,
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      no_hp: user.no_hp,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete user.password;

    return res.status(200).json({
      success: true,
      message: "OK!",
      err: null,
      data: {
        user: user,
        token: token,
      },
    });
  } catch (err) {
    next(err);
    return res.status(404).json({
      status: true,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const authenticate = async (req, res, next) => {
  try {
    const { user } = req;

    const userDetail = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        media: true,
      },
    });

    delete userDetail.password;

    return res.status(200).json({
      status: true,
      message: "OK!",
      err: null,
      data: userDetail,
    });
  } catch (err) {
    next(err);
    return res.status(404).json({
      status: true,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const getAll = async (req, res, next) => {
  try {
    const getUsers = await prisma.user.findMany({
      where: {
        role: "PENGGUNA",
      },
      select: {
        id: true,
        nama: true,
        no_hp: true,
        username: true,
        role: true,
        validasi: true,
        created: true,
        updated: true,
      },
      orderBy: {
        nama: "asc",
      },
    });

    delete getUsers.password;

    return res.status(200).json({
      success: true,
      message: "OK!",
      err: null,
      data: getUsers,
    });
  } catch (err) {
    next(err);
    return res.status(404).json({
      status: false,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    const { user } = req;

    const userDetail = await prisma.user.findUnique({
      where: {
        id: user.id,
        role: "ADMIN", // Filter berdasarkan role 'admin'
      },
    });

    if (!userDetail) {
      return res.status(404).json({
        status: true,
        message: "Admin only",
        err: "Only admins can use this command",
        data: null,
      });
    }

    next();
  } catch (err) {
    next(err);
    return res.status(404).json({
      status: true,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const updateValidasi = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
        validasi: false,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: true,
        message: "Bad Request!",
        err: "User tidak ditemukan, atau user sudah di validasi",
        data: null,
      });
    }

    const validasi = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        validasi: true,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Validasi berhasil di update",
      err: null,
      data: validasi,
    });
  } catch (err) {
    next(err);
    return res.status(404).json({
      status: true,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const updateProfileImage = async (req, res, next) => {
  try {
    const { user } = req;

    const userDetail = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userDetail) {
      return res.status(404).json({
        status: true,
        message: "Bad Request!",
        err: "User tidak ditemukan",
        data: null,
      });
    }

    // fungsi uploadFiles untuk imagekit
    const uploadFiles = async (file, id_user) => {
      try {
        let strFile = file.buffer.toString("base64");

        let { url, fileId } = await imagekit.upload({
          fileName: Date.now() + path.extname(file.originalname),
          file: strFile,
        });

        const gambar = await prisma.media.create({
          data: {
            id_link: fileId,
            link: url,
            id_user: id_user,
          },
        });

        return gambar;
      } catch (err) {
        return res.status(404).json({
          status: false,
          message: "Bad Request!",
          err: err.message,
          data: null,
        });
      }
    };

    const checkMedia = await prisma.media.findFirst({
      where: {
        id_user: user.id,
      },
    });

    await prisma.media.delete({
      where: {
        id: checkMedia.id,
      },
    });

    await uploadFiles(req.file, userDetail.id);

    delete userDetail.password;

    return res.status(201).json({
      status: true,
      message: "OK!",
      err: null,
      data: userDetail,
    });
  } catch (err) {
    next(err);
    return res.status(404).json({
      status: true,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    const { nama, email, password } = req.body;

    let userExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: "User already exists!",
        data: null,
      });
    }
    let encryptedPassword = await bcrypt.hash(password, 10);

    let users = await prisma.user.create({
      data: {
        nama,
        email,
        password: encryptedPassword,
        role: "ADMIN",
        validasi: true,
      },
    });

    delete users.password;

    return res.status(201).json({
      status: true,
      message: "OK!",
      err: null,
      data: users,
    });
  } catch (err) {
    next(err);
    return res.status(404).json({
      status: true,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

module.exports = {
  register,
  login,
  authenticate,
  getAll,
  registerAdmin,
  checkAdmin,
  updateValidasi,
  updateProfileImage,
};
