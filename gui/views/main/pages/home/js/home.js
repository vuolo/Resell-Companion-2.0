// set variable thats accessible outside the frame
// window.pokemon = "charmander";

// to access a variable from parent
// window.parent.out_var

// imports
const calendarAPI = window.parent.require('../../../utils/api/calendar.js');

// variables
var objToday = new Date(),
weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
dayOfWeek = weekday[objToday.getDay()],
domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == objToday.getDate() ? "st" : 2 == objToday.getDate() ? "nd" : 3 == objToday.getDate() ? "rd" : "th" }(),
dayOfMonth = todayDate + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
curMonth = months[objToday.getMonth()],
curYear = objToday.getFullYear(),
curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";

var todayTime = String(curHour).replace("00", "12") + ":" + curMinute + ":" + curSeconds + " " + curMeridiem;
var todayDate = curMonth + " " + dayOfMonth + ", " + curYear;

var curCalendarDate = {
  day: dayOfWeek,
  dayNumber: objToday.getDate(),
  year: curYear,
  month: curMonth
};

const kuriEmotes = [
  {
    weekday: "Sunday",
    imageURL: "../../../../images/emoticons/Delivery-Boy.png"
  },
  {
    weekday: "Monday",
    imageURL: "../../../../images/emoticons/Heart-Eyes.png"
  },
  {
    weekday: "Tuesday",
    imageURL: "../../../../images/emoticons/Banana-Boy.png"
  },
  {
    weekday: "Wednesday",
    imageURL: "../../../../images/emoticons/Masked.png"
  },
  {
    weekday: "Thursday",
    imageURL: "../../../../images/emoticons/Fancy.png"
  },
  {
    weekday: "Friday",
    imageURL: "../../../../images/emoticons/Excited.png"
  },
  {
    weekday: "Saturday",
    imageURL: "../../../../images/emoticons/Shocked.png"
  }
];

var curDayIndex = new Date().getDay();

function grabTodayKuri() {
  return kuriEmotes[curDayIndex];
}

var alertMessages = [
  {
    message: "Attention! Consignment stores are not refunding you for lost shoes from the recent lootings...",
    severityLevel: "MEDIUM" // LOW, MEDIUM, HIGH
  },
  // {
  //   message: "Watch for bears!",
  //   severityLevel: "HIGH" // LOW, MEDIUM, HIGH
  // },
  // {
  //   message: "Did you know... Dragon fruit is Kuri's favorite treat!",
  //   severityLevel: "LOW" // LOW, MEDIUM, HIGH
  // }
];

var informationSchedules = [];

window.homeApp = new Vue({
  el: "#Rewrite___Home",
  data: {
    companionSettings: window.parent.companionSettings,
    alertMessages: alertMessages,
    curAlertMessageIndex: -1,
    curCalendarDate: curCalendarDate,
    informationSchedules: informationSchedules,
    months: months,
    curScheduleIndex: -1,
    curReleaseIndex: -1,
    siteListVisible: false
  },
  methods: {
    confineTextWidth: window.parent.confineTextWidth,
    openExternal: window.parent.openExternal,
    calculateUnderlineWidth: window.parent.calculateUnderlineWidth,
    calculateUnderlineLeftOffset: window.parent.calculateUnderlineLeftOffset,
    tryTranslate: window.parent.tryTranslate,
    formatTimestamp: window.parent.formatTimestamp,
    getThemeColor: window.parent.getThemeColor,
    createOneClickTask: function(release, possibleKeywordIndex = 0) {
      let options = {
        nickname: release.name /*+ " - " + release.color*/,
        imageURL: release.imageURL,
        rawKeywords: release.possibleKeywords[possibleKeywordIndex] || ""
      };
      window.parent.frames['tasks-frame'].tasksApp.activeTaskIndex = window.parent.frames['tasks-frame'].tasksApp.addProduct(options) - 1;
      window.parent.borderApp.switchToPage(-1, 'Tasks');
    },
    getMessageSeverityColor: function(level) {
      if (level == "LOW") return "rgba(53,178,57,1)";
      else if (level == "MEDIUM") return "rgba(253,213,53,1)";
      else if (level == "HIGH") return "rgba(253,53,53,1)";
      return "rgba(53,178,57,1)";
    },
    getTitleCalendarLeft: function(maxWidth, title) {
      let titleWidth = window.parent.parent.getTextWidth(title, 'bold 27px \'SF Pro Text\'');
      if (titleWidth >= maxWidth) {
        return 0;
      } else {
        return (maxWidth/2) - ((titleWidth + (30+5))/2) + 55;
      }
      return 0;
    },
    grabTodayKuri: grabTodayKuri,
    copyText: copyText,
    animateClipboard: function(siteIndex) {
      document.querySelector('.clipboard_' + siteIndex).style.transform = 'scale(0)';
      document.querySelector('.check_' + siteIndex).style.transition = '0.2s transform ease-out';
      setTimeout(function(){ document.querySelector('.check_' + siteIndex).style.transform = 'scale(0.3125)'; }, 200);
      setTimeout(function(){ document.querySelector('.check_' + siteIndex).style.transform = 'scale(0.25)'; }, 200+200);
      setTimeout(function(){ document.querySelector('.check_' + siteIndex).style.transform = 'scale(0)'; }, 200+200+2500);
      setTimeout(function(){ document.querySelector('.clipboard_' + siteIndex).style.transform = 'scale(0.9)'; }, 200+200+2500+200);
    },
    formatBullet: function(bulletText) {
      let formattedText = bulletText;

      if (!(bulletText.includes('[') || bulletText.includes('](') || bulletText.includes(')'))) {
        return bulletText;
      } else {
        let curSearchIndex = 0;
        while(curSearchIndex < bulletText.length) {

          var curWord = '';
          var urlStartIndex = -1;
          var urlEndIndex = -1;
          if (bulletText[curSearchIndex] == '[') {

            let curInnerSearchIndex = curSearchIndex;
            while(curInnerSearchIndex < bulletText.length) {
              if (bulletText[curInnerSearchIndex] == ']') {
                curWord = bulletText.substring(curSearchIndex, curInnerSearchIndex+1);
              } else if (bulletText[curInnerSearchIndex] == '(') {
                urlStartIndex = curInnerSearchIndex+1;
              } else if (bulletText[curInnerSearchIndex] == ')') {
                urlEndIndex = curInnerSearchIndex;
                formattedText = formattedText.replace(curWord + '(' + bulletText.substring(urlStartIndex, urlEndIndex) + ')', `<a href="${bulletText.substring(urlStartIndex, urlEndIndex)}" target="_blank">${curWord.replace('[', '').replace(']', '')}</a>`);
                break;
              }
              curInnerSearchIndex++;
            }

          }

          curSearchIndex++;
        }
      }

      return formattedText;
    },
    rotateMonth: rotateMonth,
    scrollToTopOfRelease: scrollToTopOfRelease,
    dayIsSelected: function(dayIndex, month, day, year) {

      let resultDay = -1;

      let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(0);

      let numDaysInCurMonth = daysInMonth(curMonthDayIndex+1, curYearInCalculations);
      let firstDayInCurMonthIndex = new Date(curYearInCalculations, curMonthDayIndex, 1).getDay();
      let firstDayInCurMonthName = weekday[firstDayInCurMonthIndex];

      resultDay = dayIndex+1 - firstDayInCurMonthIndex;
      if (resultDay > numDaysInCurMonth) {
        // NEXT MONTH
        resultDay = dayIndex+1-numDaysInCurMonth - firstDayInCurMonthIndex;

        let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(1);
        // CHECK IF DATE HAS INFO HERE (NEXT MONTH)
        for (var i = 0; i < informationSchedules.length; i++) {
          if (i == this.curScheduleIndex && months.indexOf(month)+2 == informationSchedules[i].date.month && day == informationSchedules[i].date.day && year == informationSchedules[i].date.year) {
            return true;
          }
        }
      }

      else if (resultDay <= 0) {
        // PREVIOUS MONTH
        let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(-1);
        let numDaysInCurMonth = daysInMonth(curMonthDayIndex+1, curYearInCalculations);
        resultDay = numDaysInCurMonth+resultDay;

        // CHECK IF DATE HAS INFO HERE (PREVIOUS MONTH)
        for (var i = 0; i < informationSchedules.length; i++) {
          if (i == this.curScheduleIndex && months.indexOf(month) == informationSchedules[i].date.month  && day == informationSchedules[i].date.day && year == informationSchedules[i].date.year) {
            return true;
          }
        }
      } else {

        // CHECK IF DATE HAS INFO HERE (CURRENT MONTH)
        for (var i = 0; i < informationSchedules.length; i++) {
          if (i == this.curScheduleIndex && months.indexOf(month)+1 == informationSchedules[i].date.month && day == informationSchedules[i].date.day && year == informationSchedules[i].date.year) {
            return true;
          }
        }
      }

      return false;
    },
    findAndSetCurScheduleIndexFrom: function(dayNumber, month, day, year) {
      if (!homeApp.isDayClickable(dayNumber-1)) {
        return;
      }
      if (homeApp.isCurrentMonth(dayNumber-1) != 0.85) {
        for (var i = 0; i < informationSchedules.length; i++) {
          if (dayNumber > 8) {
            if (months.indexOf(month)+2 == informationSchedules[i].date.month && day == informationSchedules[i].date.day && year == informationSchedules[i].date.year) {
              if (i != this.curScheduleIndex) {
                scrollToTopOfRelease();
              }
              this.curScheduleIndex = i;
              this.curReleaseIndex = -1;
              break;
            }
          } else {
            if (months.indexOf(month) == informationSchedules[i].date.month && day == informationSchedules[i].date.day && year == informationSchedules[i].date.year) {
              if (i != this.curScheduleIndex) {
                scrollToTopOfRelease();
              }
              this.curScheduleIndex = i;
              this.curReleaseIndex = -1;
              break;
            }
          }
        }
      } else {
        for (var i = 0; i < informationSchedules.length; i++) {
          if (months.indexOf(month)+1 == informationSchedules[i].date.month && day == informationSchedules[i].date.day && year == informationSchedules[i].date.year) {
            if (i != this.curScheduleIndex) {
              scrollToTopOfRelease();
            }
            this.curScheduleIndex = i;
            this.curReleaseIndex = -1;
            break;
          }
        }
      }
      this.$forceUpdate();
    },
    formatScheduleDate: function(date, includeTime = false) {
      let domEnder = "";
      var objToday = date ? (typeof date === 'string' || (typeof date).includes('number') ? new Date(date) : new Date(date.year, date.month-1, date.day)) : new Date();
      // weekday = new Array(window.parent.tryTranslate('Sunday'), window.parent.tryTranslate('Monday'), window.parent.tryTranslate('Tuesday'), window.parent.tryTranslate('Wednesday'), window.parent.tryTranslate('Thursday'), window.parent.tryTranslate('Friday'), window.parent.tryTranslate('Saturday')),
      // dayOfWeek = weekday[objToday.getDay()],
      if (window.parent.companionSettings.language == "en") domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == objToday.getDate() ? window.parent.tryTranslate("st") : 2 == objToday.getDate() ? window.parent.tryTranslate("nd") : 3 == objToday.getDate() ? window.parent.tryTranslate("rd") : window.parent.tryTranslate("th") }();
      var dayOfMonth = todayDate + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
      months = new Array(window.parent.tryTranslate('January'), window.parent.tryTranslate('February'), window.parent.tryTranslate('March'), window.parent.tryTranslate('April'), window.parent.tryTranslate('May'), window.parent.tryTranslate('June'), window.parent.tryTranslate('July'), window.parent.tryTranslate('August'), window.parent.tryTranslate('September'), window.parent.tryTranslate('October'), window.parent.tryTranslate('November'), window.parent.tryTranslate('December')),
      curMonth = months[objToday.getMonth()],
      curYear = objToday.getFullYear(),
      curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
      curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
      curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
      curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";

      var todayTime = String(curHour).replace("00", "12") + ":" + curMinute + ":" + curSeconds + " " + curMeridiem;
      var todayDate = curMonth + " " + dayOfMonth;
      // translate date
      if (window.parent.companionSettings.language == "es") todayDate = dayOfMonth + " de " + curMonth;
      if (window.parent.companionSettings.language == "fr") todayDate = dayOfMonth + " " + curMonth;
      if (window.parent.companionSettings.language == "de") todayDate = dayOfMonth + ". " + curMonth;
      if (window.parent.companionSettings.language == "cn") todayDate = curMonth + dayOfMonth;

      // add time
      if (includeTime) todayDate += " • " + window.parent.formatTimestamp(objToday, true, false);

      return todayDate;
    },
    isDayClickable: function(dayIndex) {

      let resultDay = -1;

      let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(0);

      let numDaysInCurMonth = daysInMonth(curMonthDayIndex+1, curYearInCalculations);
      let firstDayInCurMonthIndex = new Date(curYearInCalculations, curMonthDayIndex, 1).getDay();
      let firstDayInCurMonthName = weekday[firstDayInCurMonthIndex];

      resultDay = dayIndex+1 - firstDayInCurMonthIndex;
      if (resultDay > numDaysInCurMonth) {
        // NEXT MONTH
        resultDay = dayIndex+1-numDaysInCurMonth - firstDayInCurMonthIndex;

        let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(1);
        // CHECK IF DATE HAS INFO HERE (NEXT MONTH)
        for (var informationSchedule of informationSchedules) {
          if (curMonthDayIndex+1 == informationSchedule.date.month && resultDay == informationSchedule.date.day && curYearInCalculations == informationSchedule.date.year) {
            return true;
          }
        }
      }

      else if (resultDay <= 0) {
        // PREVIOUS MONTH
        let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(-1);
        let numDaysInCurMonth = daysInMonth(curMonthDayIndex+1, curYearInCalculations);
        resultDay = numDaysInCurMonth+resultDay;

        // CHECK IF DATE HAS INFO HERE (PREVIOUS MONTH)
        for (var informationSchedule of informationSchedules) {
          if (curMonthDayIndex+1 == informationSchedule.date.month && resultDay == informationSchedule.date.day && curYearInCalculations == informationSchedule.date.year) {
            return true;
          }
        }
      } else {

        // CHECK IF DATE HAS INFO HERE (CURRENT MONTH)
        for (var informationSchedule of informationSchedules) {
          if (curMonthDayIndex+1 == informationSchedule.date.month && resultDay == informationSchedule.date.day && curYearInCalculations == informationSchedule.date.year) {
            return true;
          }
        }
      }


      return false;
    },
    isCurrentMonth: function(dayIndex) {
      let opacity = 0.85;

      let resultDay = -1;

      let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(0);

      let numDaysInCurMonth = daysInMonth(curMonthDayIndex+1, curYearInCalculations);
      let firstDayInCurMonthIndex = new Date(curYearInCalculations, curMonthDayIndex, 1).getDay();
      let firstDayInCurMonthName = weekday[firstDayInCurMonthIndex];

      resultDay = dayIndex+1 - firstDayInCurMonthIndex;
      if (resultDay > numDaysInCurMonth) {
        opacity = 0.33;
      }

      else if (resultDay <= 0) {
        opacity = 0.33;
      }

      return opacity;
    },
    getCalendarDay: function(dayIndex) {

      let resultDay = -1;

      let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(0);

      let numDaysInCurMonth = daysInMonth(curMonthDayIndex+1, curYearInCalculations);
      let firstDayInCurMonthIndex = new Date(curYearInCalculations, curMonthDayIndex, 1).getDay();
      let firstDayInCurMonthName = weekday[firstDayInCurMonthIndex];

      resultDay = dayIndex+1 - firstDayInCurMonthIndex;
      if (resultDay > numDaysInCurMonth) {
        resultDay = dayIndex+1-numDaysInCurMonth - firstDayInCurMonthIndex;
      }

      else if (resultDay <= 0) {
        let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(-1);
        let numDaysInCurMonth = daysInMonth(curMonthDayIndex+1, curYearInCalculations);
        resultDay = numDaysInCurMonth+resultDay;
      }

      return resultDay;
    },
    calculateCalendarDayLeft: function(dayIndex) {
      let left = 0;
      if (dayIndex%7 == 1) {
        left = 66;
      } else if (dayIndex%7 == 2) {
        left = 129;
      } else if (dayIndex%7 == 3) {
        left = 193;
      } else if (dayIndex%7 == 4) {
        left = 258;
      } else if (dayIndex%7 == 5) {
        left = 315;
      } else if (dayIndex%7 == 6) {
        left = 368;
      }
      return left;
    }
  }
});

function scrollToTopOfRelease() {
  $('.Fields_Class').scrollTop(0);
}

function getRotatedMonthYear(movement) {
  // movement is -1, 0, or 1 (-1 is left, 0 is no change, 1 is right)
  let curYearInCalculations = curCalendarDate.year;
  let curMonthDayIndex = months.indexOf(curCalendarDate.month) + movement;
  if (curMonthDayIndex > 11) {
    curMonthDayIndex = 0;
    curYearInCalculations = parseInt(curYearInCalculations)+1;
  } else if (curMonthDayIndex < 0) {
    curMonthDayIndex = 11;
    curYearInCalculations = parseInt(curYearInCalculations)-1;
  }
  return {curMonthDayIndex: curMonthDayIndex, curYearInCalculations: curYearInCalculations};
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function rotateMonth(movement) {
  // movement is -1, 0, or 1 (-1 is left, 0 is no change, 1 is right)
  let curMonthDayIndex = months.indexOf(curCalendarDate.month) + movement;
  if (curMonthDayIndex > 11) {
    curMonthDayIndex = 0;
    curCalendarDate.year = parseInt(curCalendarDate.year)+1;
  } else if (curMonthDayIndex < 0) {
    curMonthDayIndex = 11;
    curCalendarDate.year = parseInt(curCalendarDate.year)-1;
  }
  curCalendarDate.month = months[curMonthDayIndex];
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(function() {
  }, function(err) {
    console.error('Could not copy text: ', err);
  });
}

function setNearestScheduleIndex() {
  // FIND NEAREST SCHEDULE FROM informationSchedule TO CURRENT DAY AND SET AS ACTIVE
  let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(0);

  let curDay = new Date().getDate();
  let numDaysInCurMonth = daysInMonth(curMonthDayIndex+1, curYearInCalculations);
  for (var day = curDay; day <= numDaysInCurMonth; day++) {
    for (var i = 0; i < informationSchedules.length; i++) {
      if (curMonthDayIndex+1 == informationSchedules[i].date.month && day == informationSchedules[i].date.day && curYearInCalculations == informationSchedules[i].date.year) {
        homeApp.curScheduleIndex = i;
        return;
      }
    }
  }
  if (homeApp.curScheduleIndex == -1) {
    for (var day = numDaysInCurMonth; day >= 1; day--) {
      for (var i = 0; i < informationSchedules.length; i++) {
        if (curMonthDayIndex+1 == informationSchedules[i].date.month && day == informationSchedules[i].date.day && curYearInCalculations == informationSchedules[i].date.year) {
          homeApp.curScheduleIndex = i;
          return;
        }
      }
    }
  }
  if (homeApp.curScheduleIndex == -1) {
    for (var x = 1; x<=6; x++) {
      let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(1 * x);
      for (var day = 1; day <= numDaysInCurMonth; day++) {
        for (var i = 0; i < informationSchedules.length; i++) {
          if (curMonthDayIndex+1 == informationSchedules[i].date.month && day == informationSchedules[i].date.day && curYearInCalculations == informationSchedules[i].date.year) {
            homeApp.curScheduleIndex = i;
            return;
          }
        }
      }
    }
  }
  if (homeApp.curScheduleIndex == -1) {
    for (var x = 1; x<=6; x++) {
      let {curMonthDayIndex, curYearInCalculations} = getRotatedMonthYear(-1 * x);
      for (var day = numDaysInCurMonth; day >= 1; day--) {
        for (var i = informationSchedules.length-1; i >= 0; i--) {
          if (curMonthDayIndex+1 == informationSchedules[i].date.month && day == informationSchedules[i].date.day && curYearInCalculations == informationSchedules[i].date.year) {
            homeApp.curScheduleIndex = i;
            return;
          }
        }
      }
    }
  }
  homeApp.curScheduleIndex = homeApp.curScheduleIndex == -1 && informationSchedules.length > 0 ? 0 : homeApp.curScheduleIndex;
}

function getPos(str, subStr, i) {
  return str.split(subStr, i).join(subStr).length;
}

async function initalCalendarSetup() {
  let fetchedSchedules = await calendarAPI.fetchSchedules();
  if (fetchedSchedules) {
    window.parent.memory.syncObjects(informationSchedules, fetchedSchedules.schedules);
    if (fetchedSchedules.alertMessages) window.parent.memory.syncObjects(alertMessages, fetchedSchedules.alertMessages);
    await tryTranslateAlertMessages();
    setNearestScheduleIndex();
    homeApp.$forceUpdate();
    initializeAlertMessageScroll();
  }
}

window.tryTranslateAlertMessages = async (language = window.parent.companionSettings.language || "en") => {
  for (var alertMessage of alertMessages) {
    if (!alertMessage.originalMessage && language == "en") return;
    if (!alertMessage.originalMessage) alertMessage.originalMessage = alertMessage.message;
    alertMessage.message = await window.parent.translate(alertMessage.originalMessage, { from: "en", to: language, engine: 'google', key: 'AIzaSyAjeg3W1rEmviok1H2UmlPvrjOZybUb9wU'  });
  }
};

const MIN_MESSAGE_LEFT = 0;
const MAX_MESSAGE_LEFT = 1210;

async function initializeAlertMessageScroll() {
  while(true) {
    const alertMessage = document.querySelector("#alertMessage span");
    rotateAlertMessage();
    await window.parent.sleep(50);
    resetAlertMessage(alertMessage);
    beginAlertMessageScroll(alertMessage);
    await window.parent.sleep(1000 * 25);
    resetAlertMessage(alertMessage);
    await window.parent.sleep(1000 * 3);
  }
}

function beginAlertMessageScroll(alertMessage) {
  alertMessage.classList.add("scrollable");
  alertMessage.style.left = MIN_MESSAGE_LEFT - window.parent.getTextWidth(alertMessage.innerHTML, "bold 18px 'SF Pro Text'") + 'px';
}

function resetAlertMessage(alertMessage) {
  alertMessage.classList.remove("scrollable");
  alertMessage.style.left = MAX_MESSAGE_LEFT + 'px';
}

function rotateAlertMessage() {
  homeApp.curAlertMessageIndex = alertMessages.length == 0 ? -1 : ((homeApp.curAlertMessageIndex + 1) >= alertMessages.length ? 0 : (homeApp.curAlertMessageIndex + 1));
}

initalCalendarSetup();
