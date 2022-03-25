const pickWinnerBtn = document.querySelector('#pickWinner');
const correctLink = document.getElementById('correctLink')
const wrongLink = document.getElementById('wrongLink')
const toastBody = document.querySelectorAll('.toast-body');
class Youtube {
  checkLink() {
    const link = document.querySelector('#linkInput').value;
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const result = link.match(regex);
    if (result) {
      let toastCorrect = new bootstrap.Toast(correctLink)
      toastCorrect.show()
      return true;
    } else {
      let toastWrong = new bootstrap.Toast(wrongLink)
      toastWrong.show()
      return false;
    }
  }

  pickwinner() {
    this.checkLink();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  eventListeners();
})

function eventListeners() {
  pickWinnerBtn.addEventListener('click', () => { new Youtube().pickwinner() });
}
