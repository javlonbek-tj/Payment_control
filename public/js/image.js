/* Image upload */
document.querySelector('#file-1').addEventListener('change', function (e) {
  if (e.target.files.length == 0) {
    return;
  }
  document.querySelector('#file-1-preview img').src = '/image/after_upload.jpg';
  document.querySelector('#cash_info').textContent = "To'lov cheki yuklandi";
});
