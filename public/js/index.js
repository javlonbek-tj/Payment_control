const cashBtn = document.querySelector('#cashBtn');

/* alert starts here */

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 3) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(hideAlert, time * 1000);
};

cashBtn.addEventListener('submit', async e => {
  try {
    e.preventDefault();
    const userId = e.target.lastElementChild.firstElementChild.value;
  
    const res = await fetch(`/users/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      location.assign('/users');
    }
  } catch (err) {
    console.log(err);
  }
});
