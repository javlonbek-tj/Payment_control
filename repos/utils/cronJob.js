const CronJob = require('cron').CronJob;
const UserRepo = require('../../repos/user-repo');
const bcrypt = require('bcryptjs');

const job = new CronJob('0 0 1 * *', async function () {
  const allNewUsers = await UserRepo.findAllUniqueUsers();
  await allNewUsers.forEach(async user => {
    const hashedpassword = await bcrypt.hash(user.phonenumber, 12);
    UserRepo.insertUsersByHistory(
      user.firstname,
      user.lastname,
      user.course,
      user.mentor,
      user.date,
      user.login,
      hashedpassword,
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
