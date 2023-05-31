const multer = require('multer');
const { ensureDir } = require('fs-extra');

const fileStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const destinationDir = 'cashes';
    await ensureDir(destinationDir);
    cb(null, 'cashes');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

module.exports = upload;
