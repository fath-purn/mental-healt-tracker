const prisma = require("../libs/prisma");
const { moodValidationSchema } = require("../validations/mood.validation");

const create = async (req, res, next) => {
  try {
    const { user } = req;

    const { value, error } = moodValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const { mood_today } = value;

    const create = await prisma.mood.create({
      data: {
        id_user: Number(user.id),
        mood_today,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Mood berhasil dibuat",
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
    const { value, error } = moodValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const mood = await prisma.mood.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!mood) {
      return res.status(400).json({
        status: false,
        message: "Bad Request!",
        err: "Mood tidak ditemukan",
        data: null,
      });
    }

    const { mood_today } = value;

    const create = await prisma.mood.update({
      where: {
        id: mood.id,
      },
      data: {
        mood_today,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Mood berhasil diupdate",
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

const deleteMood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mood = await prisma.mood.findUnique({
      where: {
        id: Number(id),
      },
    });

    await prisma.mood.delete({
      where: {
        id: mood.id,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Mood berhasil dihapus",
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
    const mood = await prisma.mood.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        mood_today: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            no_hp: true,
            username: true,
          },
        },
      },
    });

    return res.status(201).json({
      status: true,
      message: "OK",
      err: null,
      data: mood,
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
    const mood = await prisma.mood.findMany({
      orderBy: {
        created: "desc",
      },
      select: {
        mood_today: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            no_hp: true,
            username: true,
          },
        },
      },
    });

    return res.status(201).json({
      status: true,
      message: "OK",
      err: null,
      data: mood,
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

const getAllTotal = async (req, res, next) => {
  try {
    const mood = await prisma.mood.findMany({
      orderBy: {
        created: "desc",
      },
      select: {
        mood_today: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            no_hp: true,
            username: true,
          },
        },
      },
    });

    // Menghitung total untuk setiap mood_today
    const totalMoods = mood.reduce((acc, current) => {
      const moodToday = current.mood_today;
      acc[moodToday] = (acc[moodToday] || 0) + 1;
      return acc;
    }, {});

    return res.status(201).json({
      status: true,
      message: "OK",
      err: null,
      data: { totalMoods },
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

const getMonthlyMoodPercentage = async (req, res, next) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // Mendapatkan bulan saat ini (1-12)

    // Ambil data mood untuk bulan ini
    const mood = await prisma.mood.findMany({
      where: {
        AND: [
          { created: { gte: new Date(new Date().getFullYear(), currentMonth - 1, 1) } },
          { created: { lt: new Date(new Date().getFullYear(), currentMonth, 1) } },
        ],
      },
      select: {
        mood_today: true,
      },
    });

    // Hitung jumlah masing-masing mood
    const moodCounts = mood.reduce((acc, current) => {
      acc[current.mood_today] = (acc[current.mood_today] || 0) + 1;
      return acc;
    }, {});

    // Hitung total mood
    const totalMood = Object.values(moodCounts).reduce((acc, count) => acc + count, 0);

    // Hitung persentase masing-masing mood
    const moodPercentages = {};
    for (const moodType in moodCounts) {
      const count = moodCounts[moodType];
      const percentage = (count / totalMood) * 100;
      moodPercentages[moodType] = percentage.toFixed(2);
    }

    return res.status(201).json({
      status: true,
      message: "OK",
      err: null,
      data: moodPercentages,
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

const getDailyMoodPerUser = async (req, res, next) => {
  try {
    // Mendapatkan tanggal hari ini
    const currentDate = new Date();

    // Ambil data mood hari ini untuk setiap pengguna
    const dailyMoods = await prisma.mood.findMany({
      where: {
        AND: [
          { created: { gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) } },
          { created: { lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1) } },
        ],
      },
      select: {
        mood_today: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            no_hp: true,
            username: true,
          },
        },
      },
    });

    return res.status(201).json({
      status: true,
      message: "OK",
      err: null,
      data: dailyMoods,
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
  deleteMood,
  getAllTotal,
  getMonthlyMoodPercentage,
  getDailyMoodPerUser,
};
