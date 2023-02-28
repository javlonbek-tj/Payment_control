const UserRepo = require('../repos/user-repo');
const MessageRepo = require('../repos/message-repo');
const { formatData } = require('../repos/utils/formatData');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserRepo.find();
    const unreadMessages = await MessageRepo.find();
    formatData(users);
    res.render('home', {
      pageTitle: "O'quvchilar to'lov nazorati",
      users,
      unreadMessages,
    });
  } catch (err) {
    console.log(err);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserRepo.findById(userId);
    if (!user) {
      return res.status(400).json('No user Found');
    }
    formatData(user);
    res.render('user/user-detail', {
      pageTitle: "Mening ma'lumotlarim",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserRepo.findById(userId);
    if (!user) {
      return res.status(400).json('User not found');
    }
    res.render('user/payment', {
      pageTitle: "Ma'lumotlarni o'zgartirish",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const postPayment = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const pdfCashUrl = req.file.path;
    await UserRepo.uploadCash(pdfCashUrl, userId);
    const user = await UserRepo.changePaymentStatusToProgress(userId);
    await MessageRepo.insert(
      `${user.firstname} ${user.month} oyi uchun to'lovni amalga oshirdi`,
      userId,
    );
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  getPayment,
  postPayment,
};
