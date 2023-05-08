const makeCourseUzbek = course => {
  switch (course) {
    case 'math':
      course = 'Matematika';
      break;
    case 'physics':
      course = 'Fizika';
      break;
    case 'english':
      course = 'Ingliz tili';
      break;
    case 'chemistry':
      course = 'Kimyo';
      break;
  }
  return course;
};

module.exports = makeCourseUzbek;
