const { getMonth } = require('./formatData');

class UsersByCourse {
  static usersByCourse(users, courseName) {
    return users.filter(user => {
      return user.course === courseName && user.history === false;
    });
  }

  static paidUsers(users, courseName, currentMonth) {
    return users.filter(user => {
      return user.paymentstatus === 'paid' && getMonth(user.date) === currentMonth && user.course === courseName;
    });
  }
}

module.exports = UsersByCourse;
