const CourseRepo = require('../course-repo');
const MentorRepo = require('../mentor-repo');
const UserRepo = require('../user-repo');
const UsersByCourse = require('./usersByCourse');
const { getMonth } = require('./formatData');
const MessageRepo = require('../message-repo');

const sortUsersByCourses = async (courses, allUsers) => {
  const currentMonth = getMonth(Date.now());
  return await Promise.all(
    courses.map(async course => {
      course.courseAllUsers = await UsersByCourse.usersByCourse(allUsers, course.name);
      course.coursePaidUsers = await UsersByCourse.paidUsers(allUsers, course.name, currentMonth);
      return course;
    }),
  );
};

module.exports = class LoadHomePage {
  static async allUsers() {
    const users = await UserRepo.find();
    return users;
  }

  static async allMentors() {
    const mentors = await MentorRepo.find();
    return mentors;
  }

  static async allCourses() {
    const courses = await CourseRepo.find();
    const allUsers = await LoadHomePage.allUsers();
    return sortUsersByCourses(courses, allUsers);
  }
};
