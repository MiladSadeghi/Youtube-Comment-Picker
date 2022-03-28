const pickWinnerBtn = document.querySelector('#pickWinner');
const correctLink = document.getElementById('correctLink')
const wrongLink = document.getElementById('wrongLink')
const toastBody = document.querySelectorAll('.toast-body');
const CommentCount = document.querySelector('#CommentCount');
const showResultSection = document.querySelector("#Enter")
let tokens = {};
let nextPageToken;
let keyLengh;

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

  minmaxRandomNumber(min,max) {
    return Math.floor(Math.random() * ((max-1) - min + 1)) + min;
  }

  async getDataFromAPI(APILINK) {
    tokens = {}
    CommentCount.textContent = 0;
    const response = await fetch(APILINK);
    const data = await response.json();
    nextPageToken = data.nextPageToken;
    tokens[data.nextPageToken] = data;
    CommentCount.textContent = parseInt(CommentCount.textContent) + data.pageInfo.totalResults;
    (async () => {
      while (nextPageToken) {
        let response = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&pageToken=${nextPageToken}&videoId=${this.videoID}&key=AIzaSyBTHs15QeMrH3aZxzDuvW9QEwoZyAsEAVE`);
        let data = await response.json();
        nextPageToken = data.nextPageToken;
        tokens[data.nextPageToken] = data;
        CommentCount.textContent = parseInt(CommentCount.textContent) + data.pageInfo.totalResults;
        if (!nextPageToken) {
          break;
        }
      }
      let randomKey = () => {
        if(Object.keys(tokens).length != 1) {
          let randomValue = this.minmaxRandomNumber(0, Object.keys(tokens).length - 1)
          keyLengh = Object.values(tokens)[randomValue].items.length
          return Object.values(tokens)[randomValue]
        } else {
          keyLengh = Object.values(tokens)[0].items.length
          return Object.values(tokens)[0]
        }
      }
      let randomComment = randomKey().items[this.minmaxRandomNumber(0, keyLengh)];
      
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
