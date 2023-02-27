const UserRepo = require('../repos/user-repo');
const MessageRepo = require('../repos/message-repo');
const { formatData, getCurrentMonth } = require('../repos/utils/formatData');
const { deleteFile } = require('../services/file');

const getAddUser = (req, res, next) => {
  try {
    const currentMonth = getCurrentMonth();
    res.render('admin/addUser', {
      pageTitle: "Ro'yxatga olish",
      update: null,
      currentMonth,
    });
  } catch (err) {
    console.log(err);
  }
};

const postAddUser = async (req, res, next) => {
  try {
    const { firstname, lastname, course, mentor, month, passport, phoneNumber } = req.body;
    const isUserExists = await UserRepo.isUserExists(passport, phoneNumber);
    if (isUserExists) {
      return res.status(400).json('User already exists');
    }
    const user = await UserRepo.insert(
      firstname,
      lastname,
      course,
      mentor,
      month,
      passport,
      phoneNumber,
    );
    if (!user) {
      return res.status(400).json('User not added');
    }
    res.redirect('/users');
  } catch (err) {
    console.log(err);
  }
};

const getUpdateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserRepo.findById(userId);
    if (!user) {
      return res.status(400).json('User not found');
    }
    res.render('admin/addUser', {
      pageTitle: "Ma'lumotlarni o'zgartirish",
      user,
      update: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const postUpdateUser = async (req, res, next) => {
  try {
    const { userId, firstname, lastname, course, mentor, passport, phoneNumber } = req.body;
    const oldUser = await UserRepo.findById(userId);
    if (!oldUser) {
      return res.status(400).json('User not found');
    }
    const oldFirstname = oldUser.firstname;
    const oldLastname = oldUser.lastname;
    const oldCourse = oldUser.course;
    const oldMentor = oldUser.mentor;
    const oldPassport = oldUser.passport;
    const oldPhoneNumber = oldUser.phoneNumber;
    await UserRepo.update(
      userId,
      firstname ? firstname : oldFirstname,
      lastname ? lastname : oldLastname,
      course ? course : oldCourse,
      mentor ? mentor : oldMentor,
      passport ? passport : oldPassport,
      phoneNumber ? phoneNumber : oldPhoneNumber,
    );
    res.redirect(`/users/${userId}`);
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const oldUser = await UserRepo.findById(userId);
    if (!oldUser) {
      return res.status(400).json('User not found');
    }
    await UserRepo.deleteById(userId);
    res.status(200).json('User deleted successfully');
  } catch (err) {
    console.log(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const unreadMessages = await MessageRepo.find();
    res.render('admin/messages', {
      pageTitle: 'Xabarlar',
      unreadMessages,
    });
  } catch (err) {
    console.log(err);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const { userId, messageId } = req.body;
    const user = await UserRepo.changePaymentStatusToPaid(userId);
    deleteFile(user.paymentcashurl);
    await MessageRepo.deleteById(messageId);
    res.redirect('/users');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAddUser,
  postAddUser,
  getUpdateUser,
  postUpdateUser,
  deleteUser,
  getMessages,
  confirmPayment,
};
