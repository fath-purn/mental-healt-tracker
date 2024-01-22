const prisma = require("../libs/prisma");
const { taggarValidationSchema } = require("../validations/taggar.validation");

const create = async (req, res, next) => {
  try {
    const { value, error } = taggarValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const { nama } = value;

    const isHashPrefixed = nama.startsWith("#");
    const finalNama = isHashPrefixed ? nama : `#${nama}`;

    const create = await prisma.taggar.create({
      data: {
        nama: finalNama,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Produk berhasil dibuat",
      err: null,
      data: create,
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, error } = taggarValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const taggar = await prisma.taggar.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!taggar) {
      return res.status(400).json({
        status: false,
        message: "Bad Request!",
        err: "Taggar tidak ditemukan",
        data: null,
      });
    }

    const { nama } = value;

    const isHashPrefixed = nama.startsWith("#");
    const finalNama = isHashPrefixed ? nama : `#${nama}`;

    const create = await prisma.taggar.update({
      where: {
        id: taggar.id,
      },
      data: {
        nama: finalNama,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Taggar berhasil diupdate",
      err: null,
      data: create,
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const deleteTaggar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const taggar = await prisma.taggar.findUnique({
        where: {
          id: Number(id),
        },
      });

      await prisma.taggar.delete({
        where: {
            id: taggar.id,
        }
      })
  
      return res.status(201).json({
        status: true,
        message: "Taggar berhasil dihapus",
        err: null,
        data: null,
      });
    } catch (err) {
      next(err);
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: err.message,
        data: null,
      });
    }
  };

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const taggar = await prisma.taggar.findUnique({
      where: {
        id: Number(id),
      },
    });

    return res.status(201).json({
      status: true,
      message: "Taggar",
      err: null,
      data: taggar,
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};

const getAll = async (req, res, next) => {
  try {
    const taggar = await prisma.taggar.findMany({
      orderBy: {
        nama: 'asc',
      },
    });    

    return res.status(201).json({
      status: true,
      message: "Taggar",
      err: null,
      data: taggar,
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      err: err.message,
      data: null,
    });
  }
};


module.exports = {
  create,
  update,
  getById,
  getAll,
  deleteTaggar,
};
