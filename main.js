const pickWinnerBtn = document.querySelector('#pickWinner');
const pickAnotherWinnerbtn = document.querySelector('#anotherPick');
const correctLink = document.getElementById('correctLink')
const wrongLink = document.getElementById('wrongLink')
const toastBody = document.querySelectorAll('.toast-body');
const CommentCount = document.querySelector('#CommentCount');
const showResultSection = document.querySelector("#Enter")
let youtubeClass;
let tokens = {};
let nextPageToken;
let keyLengh;

class Youtube {
  getID(link) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const result = link.match(regex);
    this.videoID = result[1];
    return this.videoID;
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

  minmaxRandomNumber(min, max) {
    return Math.floor(Math.random() * ((max - 1) - min + 1)) + min;
  }

  async getDataFromAPI(APILINK) {
    tokens = {}
    CommentCount.textContent = 0;
    const response = await fetch(APILINK);
    const data = await response.json();
    return data;
  }

  showResult() {
    let randomKey = () => {
      if (Object.keys(tokens).length != 1) {
        let randomValue = this.minmaxRandomNumber(0, Object.keys(tokens).length - 1)
        keyLengh = Object.values(tokens)[randomValue].items.length
        return Object.values(tokens)[randomValue]
      } else {
        keyLengh = Object.values(tokens)[0].items.length
        return Object.values(tokens)[0]
      }
    }
      let randomComment = randomKey().items[this.minmaxRandomNumber(0, keyLengh)];
      showResultSection.innerHTML = `
      <div class="row">
        <div class="col d-flex align-items-center">
          <img class="img-fluid" src="${randomComment.snippet.topLevelComment.snippet.authorProfileImageUrl}">
        </div>
        <div class="col d-flex align-items-center">
          <a class="text-white fs-4" target="_blank" href="${randomComment.snippet.topLevelComment.snippet.authorChannelUrl}">${randomComment.snippet.topLevelComment.snippet.authorDisplayName} <i class="bi bi-box-arrow-up-right fs-6"></i></a>
        </div>
        <div class="col d-flex align-items-center">
          <p class="text-white m-0">${randomComment.snippet.topLevelComment.snippet.textOriginal}</p>
        </div>
      </div>
      `
      pickAnotherWinnerbtn.classList.remove('d-none');
  }

  pickwinner() {
    (async () => {
      if (this.checkLink()) {
        pickAnotherWinnerbtn.classList.add('d-none');
        let api = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&video_id=${this.videoID}&key=AIzaSyBTHs15QeMrH3aZxzDuvW9QEwoZyAsEAVE`
        let data = await this.getDataFromAPI(api);
        nextPageToken = data.nextPageToken;
        tokens[data.nextPageToken] = data;
        CommentCount.textContent = parseInt(CommentCount.textContent) + data.pageInfo.totalResults;
        while (nextPageToken) {
          let response = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&pageToken=${nextPageToken}&video_id=${this.videoID}&key=AIzaSyBTHs15QeMrH3aZxzDuvW9QEwoZyAsEAVE`);
          let data = await response.json();
          nextPageToken = data.nextPageToken;
          tokens[data.nextPageToken] = data;
          CommentCount.textContent = parseInt(CommentCount.textContent) + data.pageInfo.totalResults;
          if (!nextPageToken) {
            break;
          }
        }
        this.showResult();
      }
    })()
  }
}


document.addEventListener("DOMContentLoaded", () => {
  youtubeClass = new Youtube();
  eventListeners();
})

function eventListeners() {
  pickWinnerBtn.addEventListener('click', () => {youtubeClass.pickwinner() });
  pickAnotherWinnerbtn.addEventListener('click', () => {youtubeClass.showResult() });
}
