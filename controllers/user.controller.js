const UserRepo = require('../repos/user-repo');
const MessageRepo = require('../repos/message-repo');
const { formatData, getMonth, getPrevMonthDate } = require('../repos/utils/formatData');
const findByCategories = require('../repos/utils/filtering');
const RejectedCashesRepo = require('../repos/rejectedCashes-repo');
const AppError = require('../services/AppError');
const UsersByCourse = require('../repos/utils/usersByCourse');
const makeCourseUzbek = require('../repos/utils/course-to-uzbek');
const job = require('../repos/utils/cronJob');

// Execute cron  job
job.start();

let filteredUsers = [];
const getAllUsers = async (req, res, next) => {
  try {
    let users;
    let courseName;
    if (req.query.search) {
      const { search } = req.query;
      users = await UserRepo.findPartial(search);
    } else if (req.query.course || req.query.mentor || req.query.paymentstatus || req.query.dateFrom || req.query.dateTo) {
      let { course, mentor, paymentstatus, dateFrom, dateTo } = req.query;
      courseName = makeCourseUzbek(course);
      users = await findByCategories(course, mentor, paymentstatus, dateFrom, dateTo);
    } else {
      users = await UserRepo.findAllUniqueUsers();
    }
    if (users.length > 0) {
      users.map(user => (user.date = getMonth(user.date)));
      formatData(users);
      filteredUsers.pop();
      filteredUsers.push(users);
    }
    const allUsers = await UserRepo.find();
    const mathUsers = UsersByCourse.usersByCourse(allUsers, 'Matematika');
    const mathPaidUsers = UsersByCourse.paidUsers(allUsers, 'Matematika', getPrevMonthDate().getMonth());
    const englishUsers = UsersByCourse.usersByCourse(allUsers, 'Ingliz tili');
    const englishPaidUsers = UsersByCourse.paidUsers(allUsers, 'Ingliz tili', getPrevMonthDate().getMonth());
    const physicsUsers = UsersByCourse.usersByCourse(allUsers, 'Fizika');
    const physicsPaidUsers = UsersByCourse.paidUsers(allUsers, 'Fizika', getPrevMonthDate().getMonth());
    const chemistryUsers = UsersByCourse.usersByCourse(allUsers, 'Kimyo');
    const chemistryPaidUsers = UsersByCourse.paidUsers(allUsers, 'Kimyo', getPrevMonthDate().getMonth());
    const unreadMessages = await MessageRepo.findUnreadMessages(req.user.id);
    const prevMonth = getMonth(getPrevMonthDate());
    res.render('home', {
      pageTitle: "O'quvchilar to'lov nazorati",
      users,
      unreadMessages,
      courseName,
      mathUsers,
      englishUsers,
      physicsUsers,
      chemistryUsers,
      mathPaidUsers,
      englishPaidUsers,
      physicsPaidUsers,
      chemistryPaidUsers,
      prevMonth,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserRepo.findById(userId);
    if (!user) {
      return res.status(400).json('No user Found');
    }
    const rejectedCash = await RejectedCashesRepo.findById(userId);
    formatData(user);
    const month = getMonth(user.date);
    res.render('user/user-detail', {
      pageTitle: "Mening ma'lumotlarim",
      student: user,
      month,
      rejectedCash,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const getPayment = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserRepo.findById(userId);
    if (!user) {
      return res.status(400).json('User not found');
    }
    const month = getMonth(user.date);
    res.render('user/payment', {
      pageTitle: "Ma'lumotlarni o'zgartirish",
      student: user,
      month,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const postPayment = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const pdfCashUrl = req.file.path;
    await UserRepo.uploadCash(pdfCashUrl, userId);
    const user = await UserRepo.changePaymentStatusToProgress(userId);
    const month = getMonth(user.date);
    await MessageRepo.insert(`${user.firstname} ${month} oyi uchun to'lovni amalga oshirdi`, userId);
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const getUserMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const myMessages = await MessageRepo.findAllWithoutMe(req.user.id);
    await MessageRepo.makeMessagesRead(userId);
    res.render('user/messages', {
      pageTitle: 'Xabarlar',
      myMessages,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { userId, messageId } = req.body;
    await UserRepo.deleteCash(userId);
    await MessageRepo.deleteById(messageId);
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  getPayment,
  postPayment,
  filteredUsers,
  getUserMessages,
  deleteMessage,
};
