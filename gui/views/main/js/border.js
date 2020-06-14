let pages = [
  {
    name: "Home",
    state: "Examining the release calendar..."
  },
  {
    name: "Monitors",
    state: "Watching monitors..."
  },
  {
    name: "Tasks",
    state: "Setting up tasks..."
  },
  {
    name: "Spoof",
    state: "Spoofing device locations..."
  },
  {
    name: "Browser",
    state: "Watching browsers..."
  },
  {
    name: "Analytics",
    state: "Analyzing product data..."
  },
  {
    name: "Social+",
    state: "Watching Social+ monitors..."
  }
];

window.activePageIndex = 2;

const borderApp = new Vue({
  el: "#Rewrite___Application_Border",
  data: {
    companionSettings: window.companionSettings,
    curLogin: curLogin,
    pages: pages,
    activePageIndex: window.activePageIndex,
    appVersion: appVersion
  },
  methods: {
    confineTextWidth: window.confineTextWidth,
    tryTranslate: window.tryTranslate,
    getThemeColor: window.getThemeColor,
    switchToPage: function(pageIndex) {
      this.activePageIndex = pageIndex;
      try { contentApp.activePageIndex = pageIndex; } catch(err) { console.log(err); }
      curAwaitState = pages[this.activePageIndex].state;
    }
  }
});

// ########################################## SETUP TIMES FUNCTION
function setupTimes() {
  try {
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
    var todayTime = String(curHour).replace("00", "12").replace("01", "1").replace("02", "2").replace("03", "3").replace("04", "4").replace("05", "5").replace("06", "6").replace("07", "7").replace("08", "8").replace("09", "9") + ":" + curMinute + ":" + curSeconds + " " + curMeridiem;
    var todayDate = curMonth + " " + dayOfMonth + ", " + curYear;

    document.getElementById('timeText').textContent = todayTime;
  } catch(err) {
    console.log(err);
  }
}

setupTimes();
setInterval(setupTimes, 1000);
