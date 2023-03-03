const UserRepo = require('../repos/user-repo');
const MessageRepo = require('../repos/message-repo');
const { formatData } = require('../repos/utils/formatData');
const { deleteFile } = require('../services/file');
const AdminRepo = require('../repos/admin-repo');
const { filteredUsers } = require('./user.controller');
const excelJS = require('exceljs');
const { filter } = require('compression');

const getAdminSignUp = async (req, res, next) => {
  try {
    res.render('admin/signup', {
      pageTitle: "Admin qo'shish",
    });
  } catch (err) {
    console.log(err);
  }
};

const postAdminSignUp = async (req, res, next) => {
  try {
    const { firstname, lastname, passport, phoneNumber } = req.body;
    await AdminRepo.insert(firstname, lastname, passport, phoneNumber);
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

const getAddUser = (req, res, next) => {
  try {
    res.render('admin/addUser', {
      pageTitle: "Ro'yxatga olish",
      update: null,
    });
  } catch (err) {
    console.log(err);
  }
};

const postAddUser = async (req, res, next) => {
  try {
    const { firstname, lastname, course, mentor, date, passport, phoneNumber } = req.body;
    const isUserExists = await UserRepo.isUserExists(passport, phoneNumber);
    if (isUserExists) {
      return res.status(400).json('User already exists');
    }
    await UserRepo.insert(firstname, lastname, course, mentor, date, passport, phoneNumber);
    res.redirect('/');
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
    res.redirect(`/${userId}`);
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
    await UserRepo.changePaymentStatusToPaid(userId);
    await MessageRepo.deleteById(messageId);
    res.redirect('/');
  } catch (err) {
    console.log(err);
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
      { header: 'Telefon raqami', key: 'phonenumber', width: 10 },
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
    console.log(err);
  }
};

module.exports = {
  getAdminSignUp,
  postAdminSignUp,
  getAddUser,
  postAddUser,
  getUpdateUser,
  postUpdateUser,
  deleteUser,
  getMessages,
  confirmPayment,
  getUsersExcel,
};
