class progress {
  // percentTimer;
  // progressBarTimer;
  // daysOfCurrentYear;
  // daysHavePast;
  // percent;

  constructor() {
    this.yearEle = document.querySelectorAll('.year');
    this.pastEle = document.querySelector('.days-has-past');
    this.percentEle = document.querySelector('.percent');
    this.refreshBtn = document.querySelector('.refresh-btn');
    this.progressContainer = document.querySelector('.progress-container');
    this.initPage()
  }

  setCurrentYearToPage(year) {
    this.yearEle.forEach(item => item.innerHTML = year);
  }

  getDaysOfYear(year) {
    const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    return isLeapYear ? 366 : 365;
  }

  debounce() {
    if (this.percentTimer) {
      clearTimeout(this.percentTimer)
    }
    if (this.progressBarTimer) {
      clearTimeout(this.progressBarTimer)
      const completeEle = document.querySelector('.finish');
      this.progressContainer.removeChild(completeEle);
    }
  }

  getProgress() {
    //TODO:get the full year's day amount
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDate();

    this.setCurrentYearToPage(year)
    this.daysOfCurrentYear = this.getDaysOfYear(year);

    //TODO:figure out how many day has passed from new year
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const startDate = new Date(year, 1, 1);
    const today = new Date(year, month + 1, day);

    const diffDays = Math.round(Math.abs((startDate - today) / oneDay));
    this.daysHavePast = diffDays;

    //TODO:figure out the progress
    return (diffDays / this.daysOfCurrentYear).toFixed(4) ;
  }

  setProgressBar() {
    const completeEle = document.createElement('div');
    completeEle.className = 'finish';
    this.progressContainer.appendChild(completeEle);
    this.progressBarTimer = setTimeout(() => {
        completeEle.style.width = this.percent * 100 + '%';
        clearTimeout(this.progressBarTimer);
    })
  }

  setPercentAnimation() {
    const unitPercent = parseFloat((this.percent / 180).toFixed(4));
    const timeGap = 3000 / 180;
    let dynamicPercent = 0;
    const increateByPercent = () => {
      dynamicPercent += unitPercent;
      if (dynamicPercent < this.percent) {
          this.percentEle.innerHTML = (dynamicPercent * 100).toFixed(2);
          this.pastEle.innerHTML = Math.round(this.daysOfCurrentYear * dynamicPercent);
          this.percentTimer = setTimeout(increateByPercent, timeGap);
      } else {
          this.percentEle.innerHTML = (this.percent * 100).toFixed(2);
          this.pastEle.innerHTML = this.daysHavePast;
          clearTimeout(this.percentTimer)
      }
    }
    this.percentTimer = setTimeout(increateByPercent, timeGap);
  }

  setProgressToPage() {
    this.debounce()
    this.setProgressBar()
    this.setPercentAnimation()
  }

  initPage() {
    this.percent = this.getProgress()
    this.setProgressToPage();
  }
}

window.onload = function () {
  const progressInstance = new progress()
  progressInstance.refreshBtn.addEventListener('click', () => {
    progressInstance.initPage()
  });
}