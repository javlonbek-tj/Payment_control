const month = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
];

const getMonth = queryDate => {
  const getYear = new Date(queryDate).getFullYear();
  const getMonth = month[new Date(queryDate).getMonth()];
  return ` ${getYear} yil ${getMonth}`;
};

const checkPaymentStatus = item => {
  if (item.paymentstatus === 'not paid') {
    item.paymentstatus = "To'lanmadi";
  }
  if (item.paymentstatus === 'in progress') {
    item.paymentstatus = 'Jarayonda';
  }
  if (item.paymentstatus === 'paid') {
    item.paymentstatus = "To'landi";
  }
  if (item.paymentstatus === 'rejected') {
    item.paymentstatus = 'Rad etilgan';
  }
  return item;
};

const formatData = items => {
  if (items.length > 0) {
    items.map(item => {
      item.createdAt = item.createdAt.toLocaleDateString();
      checkPaymentStatus(item);
    });
  } else {
    items.createdAt = items.createdAt.toLocaleDateString();
    checkPaymentStatus(items);
  }
  return items;
};

module.exports = {
  formatData,
  getMonth,
};
