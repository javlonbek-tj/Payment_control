class UsersByCourse {
  static usersByCourse(users, courseName) {
    return users.filter(user => {
      return user.course === courseName && user.history === false;
    });
  }

  static paidUsers(users, courseName, previousMonth) {
    return users.filter(user => {
      return user.paymentstatus === 'paid' && user.date.getMonth() === previousMonth && user.course === courseName;
    });
  }
}

module.exports = UsersByCourse;
