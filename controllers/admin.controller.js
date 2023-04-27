const UserRepo = require('../repos/user-repo');
const MessageRepo = require('../repos/message-repo');
const { getMonth, formatData } = require('../repos/utils/formatData');
const { filteredUsers } = require('./user.controller');
const excelJS = require('exceljs');
const RejectedCashesRepo = require('../repos/rejectedCashes-repo');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const AppError = require('../services/AppError');

const getAddUser = (req, res, next) => {
  try {
    res.render('admin/addUser', {
      pageTitle: "Ro'yxatga olish",
      update: null,
      error: null,
      errorMessage: null,
      student: {
        firstname: '',
        lastname: '',
        course: '',
        mentor: '',
        date: '',
        login: '',
        password: '',
        isAdmin: '',
      },
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const postAddUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { firstname, lastname, course, mentor, login, password, isAdmin } = req.body;
    const phoneNumber = password;
    let { date } = req.body;
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/addUser', {
        pageTitle: "Ro'yxatga olish",
        update: null,
        error: true,
        errorMessage: errors.array()[0].msg,
        student: {
          firstname,
          lastname,
          course,
          mentor,
          date,
          login,
          password,
          isAdmin,
        },
      });
    }
    if (date == '') {
      date = new Date(Date.now());
    }
    const isUserExists = await UserRepo.isUserExists(login);
    if (isUserExists) {
      return res.status(400).render('admin/addUser', {
        pageTitle: "Ro'yxatga olish",
        update: null,
        error: true,
        errorMessage: 'Ushbu login password boshqa foydalanuvchiga tegishli',
        student: {
          firstname,
          lastname,
          course,
          mentor,
          date,
          login,
          password,
          isAdmin,
        },
      });
    }
    const hashedpassword = await bcrypt.hash(password, 12);
    if (isAdmin === 'admin') {
      await UserRepo.insert(
        firstname,
        lastname,
        course,
        mentor,
        date,
        login,
        hashedpassword,
        phoneNumber,
        'admin',
      );
    } else {
      await UserRepo.insert(
        firstname,
        lastname,
        course,
        mentor,
        date,
        login,
        hashedpassword,
        phoneNumber,
        'user',
      );
    }
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
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
      student: user,
      update: true,
      error: null,
      errorMessage: '',
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const postUpdateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { userId, firstname, lastname, course, mentor, login, password } = req.body;
    const phoneNumber = password;
    const oldUser = await UserRepo.findById(userId);
    if (!oldUser) {
      return res.status(400).json('Ushbu foydalanuvchi topilmadi');
    }
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/addUser', {
        pageTitle: "Ro'yxatga olish",
        update: true,
        error: true,
        errorMessage: errors.array()[0].msg,
        student: {
          firstname,
          lastname,
          course,
          mentor,
          login,
          password,
        },
      });
    }
    const oldFirstname = oldUser.firstname;
    const oldLastname = oldUser.lastname;
    const oldCourse = oldUser.course;
    const oldMentor = oldUser.mentor;
    const oldlogin = oldUser.login;
    const oldpassword = oldUser.password;
    const oldPhoneNumber = oldUser.phoneNumber;
    let hashedpassword;
    if (password) {
      hashedpassword = await bcrypt.hash(password, 12);
    }
    await UserRepo.update(
      userId,
      firstname ? firstname : oldFirstname,
      lastname ? lastname : oldLastname,
      course ? course : oldCourse,
      mentor ? mentor : oldMentor,
      login ? login : oldlogin,
      password ? hashedpassword : oldpassword,
      password ? phoneNumber : oldPhoneNumber,
    );
    res.redirect(`/users/${userId}`);
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const oldUser = await UserRepo.findById(userId);
    if (!oldUser) {
      return res.status(400).json('User not found');
    }
    await UserRepo.deleteById(userId);
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const getMessages = async (req, res, next) => {
  try {
    const myMessages = await MessageRepo.findAllWithoutMe(req.user.id);
    await MessageRepo.makeMessagesRead(req.user.id);
    res.render('admin/messages', {
      pageTitle: 'Xabarlar',
      myMessages,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const { userId, messageId } = req.body;
    await UserRepo.changePaymentStatusToPaid(userId);
    await MessageRepo.deleteById(messageId);
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};
const rejectPayment = async (req, res, next) => {
  try {
    const { userId, rejectionReason, messageId } = req.body;
    const user = await UserRepo.changePaymentStatusToRejected(userId);
    await RejectedCashesRepo.insert(user.paymentcashurl, userId);
    await MessageRepo.deleteById(messageId);
    const month = getMonth(user.date);
    await MessageRepo.insert(
      `Sizning ${month} oyi uchun to'lovingiz rad etildi. ${rejectionReason}.`,
      req.user.id,
    );
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const getUsersExcel = async (req, res, next) => {
  try {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');
    const path = 'files';
    worksheet.columns = [
      { header: '№', key: 'id', width: 10 },
      { header: 'Ism Familiya', key: 'firstname', width: 10 },
      { header: 'Sharif', key: 'lastname', width: 10 },
      { header: 'Kurs', key: 'course', width: 10 },
      { header: 'Mentor', key: 'mentor', width: 10 },
      { header: 'Telefon raqami', key: 'password', width: 10 },
      { header: "To'lov holati", key: 'paymentstatus', width: 10 },
    ];
    let counter = 1;
    filteredUsers[0].forEach(user => {
      user.id = counter;
      worksheet.addRow(user); // Add data in worksheet
      counter++;
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const getRejectedCashes = async (req, res, next) => {
  try {
    const rejectedCashes = await RejectedCashesRepo.find();
    if (rejectedCashes.length > 0) {
      formatData(rejectedCashes);
    }
    res.render('admin/rejectedCashes', {
      pageTitle: 'Rad etilgan cheklar',
      rejectedCashes,
    });
  } catch (err) {
    next(new AppError(err, 500));
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
  rejectPayment,
  getUsersExcel,
  getRejectedCashes,
};
