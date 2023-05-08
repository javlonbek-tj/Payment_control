const CronJob = require('cron').CronJob;
const UserRepo = require('../../repos/user-repo');

const job = new CronJob('0 0 1 * *', async function () {
  console.log(1);
  const allNewUsers = await UserRepo.findAllUniqueUsers();
  allNewUsers.forEach(user => {
    UserRepo.insertUsersByHistory(
      user.firstname,
      user.lastname,
      user.course,
      user.mentor,
      user.date,
      user.login,
      user.phonenumber,
      user.phonenumber,
      user.paymentstatus,
      user.paymentcashurl,
      user.paymentbycash,
      user.role,
      'true',
    );
  });
  await UserRepo.passUserToTheNextMonth();
});

module.exports = job;
