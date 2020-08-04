// variables
const BANNER_DISPLAY_TIME = 3 * 1000;
const BANNER_COOLDOWN = 300;

window.notifications = [];
var bannerQueue = [];

window.addEventListener("DOMContentLoaded", (e) => {
  window.notificationsApp = new Vue({
    el: "#notificationBannerArea",
    data: {
      companionSettings: window.companionSettings,
      notifications: window.notifications,
      banner: null,
      allowBannerLeave: true
    },
    methods: {
      confineTextWidth: window.confineTextWidth,
      calculateUnderlineWidth: window.calculateUnderlineWidth,
      calculateUnderlineLeftOffset: window.calculateUnderlineLeftOffset,
      tryTranslate: window.tryTranslate,
      getThemeColor: window.getThemeColor,
      getColor: window.getColor,
      tryHideBanner: tryHideBanner,
      evalClickFunc: function(notification) {
        eval(notification.clickFunc);
      }
    }
  });
});

function notificationInBannerQueue(notification) {
  for (var banner in window.bannerQueue) if (notification.id == banner.id) return true;
  return false;
}

async function tryHideBanner(notification = window.notificationsApp.banner, force = false) {
  if (!force) {
    let startBannerLeave = window.notificationsApp.allowBannerLeave;
    while (!window.notificationsApp.allowBannerLeave) await window.sleep(50);
    if (!startBannerLeave) await window.sleep(BANNER_DISPLAY_TIME);
  }
  if (!window.notificationsApp.allowBannerLeave && !force) tryHideBanner(notification);
  else {
    if (!notification.isBanner) return;
    notification.isBanner = false;
    setTimeout(() => { // nullify displayed banner
      window.notificationsApp.banner = null;
      // attempt to show next banner in queue
      if (bannerQueue.length > 0) displayBanner(bannerQueue[0]);
    }, 100 + BANNER_COOLDOWN); // + transition time
  }
}

function displayBanner(notification) {
  if (window.notificationsApp.banner) { if (!notificationInBannerQueue(notification)) bannerQueue.push(notification); }
  else {
    let bannerQueueIndex = bannerQueue.indexOf(notification);
    if (bannerQueueIndex != -1) bannerQueue.splice(bannerQueueIndex, 1);
    window.notificationsApp.banner = notification;
    setTimeout(() => { // show banner
      notification.isBanner = true;
      window.notificationsApp.allowBannerLeave = true;
      setTimeout(() => { // hide banner
        tryHideBanner(notification);
      }, BANNER_DISPLAY_TIME); // + display time
    }, 50); // + time gap to initialize element with previous position
  }
}

// MAIN sendNotification function... create all new notifications through here
window.sendNotification = (options) => {
  let newNotification = {
    title: options.title || "Checked Out!",
    description: options.description || "Yeezy Boost 350 Yechae (8.5)",
    statusColor: options.statusColor || "green",
    clickFunc: options.clickFunc || "",
    imageURL: options.imageURL || "",
    read: false,
    timestamp: new Date().getTime(),
    isBanner: false,
    id: window.makeid(10) // assign a new id to each notification
  }
  notifications.push(newNotification);
  displayBanner(newNotification);
};

window.shootConfetti = () => {
  window.frames['confetti-overlay'].shootConfetti();
};
