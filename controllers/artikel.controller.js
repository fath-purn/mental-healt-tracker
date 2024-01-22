const prisma = require("../libs/prisma");
const {
  artikelUpdateValidationSchema,
  artikelValidationSchema,
} = require("../validations/artikel.validation");
const imagekit = require("../libs/imagekit");
const path = require("path");

const create = async (req, res, next) => {
  try {
    console.log(req.body, 'adf')
    const { value, error } = artikelValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const { judul, deskripsi, id_taggar } = value;

    const taggar = await prisma.taggar.findUnique({
      where: {
        id: Number(id_taggar),
      },
    });

    if (!taggar) {
      return res.status(404).json({
        status: false,
        message: "Bad Request!",
        err: "Taggar tidak ditemukan",
        data: null,
      });
    }

    const create = await prisma.artikel.create({
      data: {
        judul,
        deskripsi,
        id_taggar: taggar.id,
      },
    });

    // fungsi uploadFiles untuk imagekit
    const uploadFiles = async (file, id_artikel) => {
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
            id_artikel: id_artikel,
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

    if (req.file) {
      await uploadFiles(req.file, create.id);
    }

    return res.status(201).json({
      status: true,
      message: "Artikel berhasil dibuat",
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
    const { value, error } = artikelUpdateValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const artikel = await prisma.artikel.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!artikel) {
      return res.status(400).json({
        status: false,
        message: "Bad Request!",
        err: "Artikel tidak ditemukan",
        data: null,
      });
    }

    const { judul, deskripsi, id_taggar } = value;

    let taggar = null;
    if (id_taggar) {
      taggar = await prisma.taggar.findUnique({
        where: {
          id: Number(id_taggar),
        },
      });

      if (!taggar) {
        return res.status(404).json({
          status: false,
          message: "Bad Request!",
          err: "Taggar tidak ditemukan",
          data: null,
        });
      }
    }

    const create = await prisma.artikel.update({
      where: {
        id: artikel.id,
      },
      data: {
        judul: judul ? judul : artikel.judul,
        deskripsi,
        id_taggar: taggar.id,
      },
    });

    const checkMedia = await prisma.media.findFirst({
      where: {
        id_artikel: create.id,
      },
    });

    // fungsi uploadFiles untuk imagekit
    const uploadFiles = async (file, id_artikel) => {
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
            id_artikel: id_artikel,
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

    if (req.file) {
      //   await imagekit.deleteFile(checkMedia.id_link);

      await prisma.media.delete({
        where: {
          id: checkMedia.id,
        },
      });

      await uploadFiles(req.file, create.id);
    }

    return res.status(201).json({
      status: true,
      message: "Artikel berhasil diupdate",
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

const deleteArtikel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artikel = await prisma.artikel.findUnique({
      where: {
        id: Number(id),
      },
    });

    const checkMedia = await prisma.media.findFirst({
      where: {
        id_artikel: artikel.id,
      },
    });

    await prisma.media.delete({
      where: {
        id: checkMedia.id,
      },
    });

    await prisma.artikel.delete({
      where: {
        id: artikel.id,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Artikel berhasil dihapus",
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
    const artikel = await prisma.artikel.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        media: {
          select: {
            id: true,
            link: true,
          },
        },
        taggar: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    if (!artikel) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: "Artikel tidak ditemukan",
        data: null,
      });
    }

    const artikelRapi = {
      id: artikel.id,
      judul: artikel.judul,
      deskripsi: artikel.deskripsi,
      taggar: artikel.taggar.nama,
      media: artikel.media[0].link,
      created: artikel.created,
      update: artikel.created,
    };

    return res.status(200).json({
      status: true,
      message: "Artikel",
      err: null,
      data: artikelRapi,
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
    let artikel = null;

    if (req.query.search) {
      const { search } = req.query;
      artikel = await prisma.artikel.findMany({
        where: {
          judul: {
            contains: search,
            mode: 'insensitive',
          },
        },
        include: {
          media: {
            select: {
              id: true,
              link: true,
            },
          },
          taggar: {
            select: {
              id: true,
              nama: true,
            },
          },
        },
      });
    } else {
      artikel = await prisma.artikel.findMany({
        include: {
          media: {
            select: {
              id: true,
              link: true,
            },
          },
          taggar: {
            select: {
              id: true,
              nama: true,
            },
          },
        },
      });
    }

    // Mengonversi struktur data sesuai dengan keinginan
    const transformedData = artikel.map((artikel) => {
      const { id, judul, deskripsi, taggar, media, created, updated } = artikel;

      return {
        id,
        judul,
        deskripsi,
        taggar: taggar.nama,
        media: media[0].link,
        created,
        updated,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Artikel",
      err: null,
      data: transformedData,
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
  deleteArtikel,
};
