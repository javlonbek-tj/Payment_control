const CourseRepo = require('../course-repo');
const MentorRepo = require('../mentor-repo');
const UserRepo = require('../user-repo');
const UsersByCourse = require('./usersByCourse');
const { getMonth, getPrevMonthDate } = require('./formatData');
const MessageRepo = require('../message-repo');

const sortUsersByCourses = async (courses, allUsers) => {
  const prevMonth = getPrevMonthDate().getMonth();
  return await Promise.all(
    courses.map(async course => {
      course.courseAllUsers = await UsersByCourse.usersByCourse(allUsers, course.name);
      course.coursePaidUsers = await UsersByCourse.paidUsers(allUsers, course.name, prevMonth);
      return course;
    }),
  );
};

module.exports = class LoadHomePage {
  static allUsers = async () => await UserRepo.find();

  static allMentors = async () => await MentorRepo.find();

  static allCourses = async () => {
    const courses = await CourseRepo.find();
    const allUsers = await LoadHomePage.allUsers();
    return await sortUsersByCourses(courses, allUsers);
  };

  static unreadMessages = async id => MessageRepo.findUnreadMessages(id);
};
