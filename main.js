const pickWinnerBtn = document.querySelector('#pickWinner');
const correctLink = document.getElementById('correctLink')
const wrongLink = document.getElementById('wrongLink')
const toastBody = document.querySelectorAll('.toast-body');
const CommentCount = document.getElementById('commentCount');
let tokens = {};
let nextPageToken;

class Youtube {
  getID(link) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const result = link.match(regex);
    this.videoID = result[1];
    return this.videoID
  }

  checkLink() {
    const link = document.querySelector('#linkInput').value;
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const result = link.match(regex);
    if (result) {
      let toastCorrect = new bootstrap.Toast(correctLink)
      toastCorrect.show()
      this.getID(link);
      return true;
    } else {
      let toastWrong = new bootstrap.Toast(wrongLink)
      toastWrong.show()
      return false;
    }
  }

  async getDataFromAPI(APILINK) {
    const response = await fetch(APILINK);
    const data = await response.json();
    nextPageToken = data.nextPageToken;
    tokens[data.nextPageToken] = data;
    (async () => {
      while (nextPageToken) {
        let response = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&pageToken=${nextPageToken}&videoId=${this.videoID}&key=AIzaSyBTHs15QeMrH3aZxzDuvW9QEwoZyAsEAVE`);
        let data = await response.json();
        nextPageToken = data.nextPageToken;
        tokens[data.nextPageToken] = data;
        if (!nextPageToken) {
          break;
        }
      }
    })();
  }

  pickwinner() {
    if (this.checkLink()) {
      let api = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&videoId=${this.videoID}&key=AIzaSyBTHs15QeMrH3aZxzDuvW9QEwoZyAsEAVE`
      this.getDataFromAPI(api);
    }
  }
}


document.addEventListener("DOMContentLoaded", () => {
  eventListeners();
})

function eventListeners() {
  pickWinnerBtn.addEventListener('click', () => { new Youtube().pickwinner() });
}
