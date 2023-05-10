const UserRepo = require('../repos/user-repo');
const MessageRepo = require('../repos/message-repo');
const { getMonth, formatData, getPrevMonthDate } = require('../repos/utils/formatData');
const { filteredUsers } = require('./user.controller');
const excelJS = require('exceljs');
const RejectedCashesRepo = require('../repos/rejectedCashes-repo');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const AppError = require('../services/AppError');
const CourseRepo = require('../repos/course-repo');
const MentorRepo = require('../repos/mentor-repo');
const LoadHomePage = require('../repos/utils/homePageLoads');

const getAddUser = async (req, res, next) => {
  try {
    const courses = await CourseRepo.find();
    const mentors = await MentorRepo.find();
    let errorMessage = null;
    if (courses.length === 0 || mentors.length === 0) {
      errorMessage = `Iltimos avval mentor va kursni qo'shing`;
    }
    res.render('admin/addUser', {
      pageTitle: "Ro'yxatga olish",
      update: null,
      error: null,
      errorMessage,
      courses,
      mentors,
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

const getAddCourse = async (req, res, next) => {
  try {
    const courses = await CourseRepo.find();
    res.render('admin/addCourse', {
      pageTitle: `Kurs qo'shish`,
      errorMessage: null,
      courses,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const postAddCourse = async (req, res, next) => {
  try {
    const courses = await CourseRepo.find();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/addCourse', {
        pageTitle: `Kurs qo'shish`,
        errorMessage: errors.array()[0].msg,
        courses,
      });
    }
    const { name } = req.body;
    const course = await CourseRepo.findByName(name);
    if (course.length > 0) {
      return res.render('admin/addCourse', {
        pageTitle: `Kurs qo'shish`,
        errorMessage: `${name} oldin qo'shilgan`,
        courses,
      });
    }
    await CourseRepo.insert(name);
    res.redirect('/admin/addCourse');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const getAddMentor = async (req, res, next) => {
  try {
    const mentors = await MentorRepo.find();
    res.render('admin/addMentor', {
      pageTitle: `Mentor qo'shish`,
      errorMessage: null,
      mentors,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const postAddMentor = async (req, res, next) => {
  try {
    const mentors = await MentorRepo.find();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/addMentor', {
        pageTitle: `Mentor qo'shish`,
        errorMessage: errors.array()[0].msg,
        mentors,
      });
    }
    const { name } = req.body;
    const mentor = await MentorRepo.findByName(name);
    if (mentor.length > 0) {
      return res.render('admin/addMentor', {
        pageTitle: `Mentor qo'shish`,
        errorMessage: `${name} oldin qo'shilgan`,
        mentors,
      });
    }
    await MentorRepo.insert(name);
    res.redirect('/admin/addMentor');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const postAddUser = async (req, res, next) => {
  try {
    const courses = await CourseRepo.find();
    const mentors = await MentorRepo.find();
    const errors = validationResult(req);
    const { firstname, lastname, course, mentor, password, isAdmin } = req.body;
    const phoneNumber = password;
    let { date, login } = req.body;
    login = login.toLowerCase();
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/addUser', {
        pageTitle: "Ro'yxatga olish",
        update: null,
        error: true,
        courses,
        mentors,
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
      await UserRepo.insert(firstname, lastname, course, mentor, date, login, hashedpassword, phoneNumber, 'admin');
    } else {
      await UserRepo.insert(firstname, lastname, course, mentor, date, login, hashedpassword, phoneNumber, 'user');
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
    let { userId, firstname, lastname, course, mentor, login, password } = req.body;
    login = login.toLowerCase();
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
    await MessageRepo.deleteById(messageId);
    await UserRepo.changePaymentStatusToPaid(userId);
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const payByCash = async (req, res, next) => {
  try {
    const { userId } = req.body;
    await UserRepo.paidByCash(userId);
    await UserRepo.changePaymentStatusToPaid(userId);
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
    await MessageRepo.insert(`Sizning ${month} oyi uchun to'lovingiz rad etildi. ${rejectionReason}.`, req.user.id);
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
    if (filteredUsers.length > 0) {
      filteredUsers[0].forEach(user => {
        user.id = counter;
        worksheet.addRow(user); // Add data in worksheet
        counter++;
      });
    }
    // Making first line in excel bold
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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

const postDeleteMentor = async (req, res, next) => {
  try {
    const { mentorId } = req.body;
    await MentorRepo.deleteMentor(mentorId);
    res.redirect('/admin/addMentor');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const postDeleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    await CourseRepo.deleteCourse(courseId);
    res.redirect('/admin/addCourse');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const historyUsers = async (req, res, next) => {
  try {
    const users = await UserRepo.find();
    const courses = await LoadHomePage.allCourses();
    const mentors = await LoadHomePage.allMentors();
    const unreadMessages = await LoadHomePage.unreadMessages(req.user.id);
    const prevMonth = getMonth(getPrevMonthDate());
    res.render('home', {
      pageTitle: `Barcha o'quvchilar`,
      users,
      courseName: `Barcha o'quvchilar(oylar bo'yicha)`,
      courses,
      mentors,
      prevMonth,
      unreadMessages,
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
  payByCash,
  rejectPayment,
  getUsersExcel,
  getRejectedCashes,
  getAddCourse,
  postAddCourse,
  getAddMentor,
  postAddMentor,
  postDeleteMentor,
  postDeleteCourse,
  historyUsers,
};
