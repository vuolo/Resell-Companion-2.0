// variables
const BANNER_DISPLAY_TIME = 3 * 1000;
const BANNER_COOLDOWN = 300;

window.notifications = [];
window.bannerQueue = [];

var sounds = {
  'negative': { // bad notification (red)
    audio: new Audio('../../audio/negative.mp3'),
    playable: true
  },
  'neutral': { // normal notifications (blue, yellow, orange, purple, etc.)
    audio: new Audio('../../audio/neutral.mp3'),
    playable: true
  },
  'positive': { // good notification (green)
    audio: new Audio('../../audio/positive.mp3'),
    playable: true
  },
  'outgoing': { // TBD
    audio: new Audio('../../audio/outgoing.mp3'),
    playable: true
  },
  'whoosh': { // TBD
    audio: new Audio('../../audio/whoosh.mp3'),
    playable: true
  }
};

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
      getBannerImage: function(imageLabel) {
        switch (imageLabel) {
          case 'supreme':
            return `../../images/stores/Supreme-bw${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;
          case 'shopify':
            return `../../images/stores/Shopify-full-bw${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;
          case 'adidas':
            return `../../images/stores/adidas-full${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;
          case 'snkrs':
            return `../../images/stores/SNKRS-bw${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;

          case 'twitter':
            return `../../images/Twitter-bw${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;
          case 'instagram':
            return `../../images/Instagram-bw${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;

          case 'silhouette':
            return `../../images/silhouette${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;

          case 'stockx':
            return `../../images/stores/StockX-bw${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;
          case 'goat':
            return `../../images/stores/Goat${this.companionSettings.theme == 'dark' ? '-white' : ''}.png`;
        }
      },
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
      if (window.bannerQueue.length > 0) displayBanner(window.bannerQueue[0]);
    }, 100 + BANNER_COOLDOWN); // + transition time
  }
}
window.tryHideBanner = tryHideBanner;

function displayBanner(notification) {
  if (window.notificationsApp.banner) { if (!notificationInBannerQueue(notification)) window.bannerQueue.push(notification); }
  else {
    let bannerQueueIndex = window.bannerQueue.indexOf(notification);
    if (bannerQueueIndex != -1) window.bannerQueue.splice(bannerQueueIndex, 1);
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

function tryPlayAudio(audio) {
  if (!sounds[audio].playable) return;
  sounds[audio].audio.cloneNode().play(); // play audio (clone to have multiple instances of same audio)
  sounds[audio].playable = false;
  setTimeout(function() { sounds[audio].playable = true; }, 100); // wait 100 ms to prevent a major audio stack
}

function sendDesktopNotification(notification) {
  let desktopNotification = new Notification(notification.title, {
    icon: '../../images/emoticons/Delivery-Boy.png',
    lang: window.companionSettings.language.toUpperCase(),
    body: notification.description,
    silent: true,
    tag: notification.id
  });

  // initialize onclick for desktop notification
  desktopNotification.onclick = () => {
    notification.read = true;
    if (notification.clickFunc.length > 0) window.notificationsApp.evalClickFunc(notification);
  }

  return desktopNotification;
}

// MAIN sendNotification function... create all new notifications through here
window.sendNotification = (options) => {
  let newNotification = {
    title: options.title || "",
    description: options.description || "",
    statusColor: options.statusColor || "",
    clickFunc: options.clickFunc || "",
    imageLabel: options.imageLabel || "",
    desktopNotification: null,
    read: false,
    timestamp: new Date().getTime(),
    isBanner: false,
    id: window.makeid(10) // assign a new id to each notification
  }
  notifications.push(newNotification);

  // display banner
  if (window.companionSettings.notifications.banners) displayBanner(newNotification);

  // shoot confetti on checkouts
  if (newNotification.title == "Checked Out!" && newNotification.statusColor == "green") window.shootConfetti();

  // play audio (depending on color)
  if (window.companionSettings.notifications.sounds) { // check if notification sounds are enabled
    switch (newNotification.statusColor) {
      case 'green':
        tryPlayAudio('positive');
        break;
      case 'red':
        tryPlayAudio('negative');
        break;
      default:
        tryPlayAudio('neutral');
    }
  }

  // send desktop
  if (window.companionSettings.notifications.desktop) newNotification.desktop = sendDesktopNotification(newNotification);
};

window.shootConfetti = () => {
  window.frames['confetti-overlay'].shootConfetti();
};
