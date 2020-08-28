var percentTimer;
var progressBarTimer;
var yearEle = document.querySelectorAll('.year');
var pastEle = document.querySelector('.days-has-past');
var percentEle = document.querySelector('.percent');
var refreshBtn = document.querySelector('.refresh-btn');
var progressContainer = document.querySelector('.progress-container');
var daysOfCurrentYear;
var daysHavePast;
var percent;

function setCurrentYearToPage(year) {
  yearEle.forEach(item => item.innerHTML = year);
}

function getDaysOfYear(year) {
  const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  return isLeapYear ? 366 : 365;
}

function debounce() {
  if (percentTimer) {
    clearTimeout(percentTimer)
  }
  if (progressBarTimer) {
    clearTimeout(progressBarTimer)
    const completeEle = document.querySelector('.finish');
    progressContainer.removeChild(completeEle);
  }
}

function getProgress() {
  //TODO:get the full year's day amount
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();

  setCurrentYearToPage(year)
  daysOfCurrentYear = getDaysOfYear(year);

  //TODO:figure out how many day has passed from new year
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const startDate = new Date(year, 1, 1);
  const today = new Date(year, month + 1, day);

  const diffDays = Math.round(Math.abs((startDate - today) / oneDay));
  daysHavePast = diffDays;

  //TODO:figure out the progress
  return (diffDays / daysOfCurrentYear).toFixed(4) ;
}

function setProgressBar() {
  const completeEle = document.createElement('div');
  completeEle.className = 'finish';
  progressContainer.appendChild(completeEle);
  progressBarTimer = setTimeout(() => {
      completeEle.style.width = percent * 100 + '%';
      clearTimeout(progressBarTimer);
  })
}

function setPercentAnimation() {
  const unitPercent = parseFloat((percent / 180).toFixed(4));
  const timeGap = 3000 / 180;
  let dynamicPercent = 0;
  percentTimer = setTimeout(function increateByPercent() {
      dynamicPercent += unitPercent;
      if (dynamicPercent < percent) {
          percentEle.innerHTML = (dynamicPercent * 100).toFixed(2);
          pastEle.innerHTML = Math.round(daysOfCurrentYear * dynamicPercent);
          percentTimer = setTimeout(increateByPercent, timeGap);
      } else {
          percentEle.innerHTML = (percent * 100).toFixed(2);
          pastEle.innerHTML = daysHavePast;
          clearTimeout(percentTimer)
      }
  }, timeGap);
}

function setProgressToPage() {
  debounce()
  setProgressBar()
  setPercentAnimation()
}

function initPage() {
  percent = getProgress()
  setProgressToPage();
}

window.onload = function () {
  initPage()
  refreshBtn.addEventListener('click', initPage);
}