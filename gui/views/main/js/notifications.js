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
  let desktopNotification = new Notification(window.tryTranslate(notification.title), {
    icon: '../../images/emoticons/Delivery-Boy.png',
    lang: window.companionSettings.language.toUpperCase(),
    body: window.tryTranslate(notification.description),
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

function getWebhookColor(color) {
  switch (color) {
    case 'green': return 0x35b239;
    case 'red': return 0xfd3535;
    case 'yellow': return 0xfdd535;
    case 'orange': return 0xffa74e;
    case 'blue': return 0x5bb6bb;
    case 'purple': return 0xce8ce5;
    default: return 0xd8b97b; // gold is default color
  }
}

function trySendWebhook(notification) {
  // setup webhook options
  var webhookOptions = {
    username: "Resell Companion",
    avatar_url: "https://resell.monster/images/buddy-transparent-compressed.png",
    embeds: [{
      title: window.tryTranslate(notification.title),
      description: window.tryTranslate(notification.description),
      footer: {
        icon_url: "https://resell.monster/images/buddy-transparent-compressed.png",
        text: "Resell Companion" + " • " + window.frames['home-frame'].homeApp.formatTimestamp()
      },
      color: getWebhookColor(notification.statusColor)
    }]
  };

  // format webhook options according to data
  if ( // Task notification
    notification.data &&
    notification.data.node != undefined &&
    notification.data.billingProfile != undefined &&
    notification.data.product != undefined &&
    notification.data.variant != undefined
  ) {
    // overwrite initialized options
    webhookOptions.embeds[0].description = null;

    // new options
    webhookOptions.embeds[0].thumbnail = { url: notification.data.product.ImageURL };
    webhookOptions.embeds[0].author = {
      name: notification.data.product.StoreName,
      url: `https://${notification.data.product.Store}` // #resellmonster
    }

    // create & assign fields
    webhookOptions.embeds[0].fields = [
      {
        name: `${window.tryTranslate('Product')}`,
        value: notification.data.product.Name || window.tryTranslate('Unknown Product')
      },
      {
        name: `${window.tryTranslate('Size')}`,
        value: notification.data.variant.Name || window.tryTranslate('Unknown Size')
      },
      {
        name: `${window.tryTranslate('Price')}`,
        value: window.frames['monitors-frame'].getCurrencySymbolFromPrice(notification.data.product.Price) + window.numberWithCommas(parseFloat(Number(notification.data.product.Price.replace(/[^0-9\.]+/g,""))).toFixed(2))
      },
      {
        name: `${window.tryTranslate('Billing Profile')}`,
        value: '||' + (notification.data.billingProfile.settings.nickname || window.tryTranslate('N/A')) + '||'
      },
      {
        name: `${window.tryTranslate('Checkout Time (ms)')}`,
        value: window.numberWithCommas(new Date().getTime() - notification.data.node.startTimestamp)
      },
      {
        name: `${window.tryTranslate('Checkout Delay (ms)')}`,
        value: window.numberWithCommas(notification.data.billingProfile.settings.autoCheckoutDelay || 0)
      }
    ];

    if (notification.data.product.Identifier == 'shopify' && notification.data.node.checkoutURL && !notification.data.node.checkoutURL.includes('unknown-checkout')) webhookOptions.embeds[0].fields.push({
      name: `${window.tryTranslate('Checkout URL')}`,
      value: `[${window.tryTranslate('Click here')}](${notification.data.node.checkoutURL})`
    });

  } else if ( // TODO: Social+ notification (both discord joined and link opened)
    notification.data &&
    false
  ) {}

  // post webhook to URL
  fetch(window.companionSettings.webhook.URL, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(webhookOptions) });
}

// MAIN sendNotification function... create all new notifications through here
window.sendNotification = (options) => {
  let newNotification = {
    title: options.title || "",
    description: options.description || "",
    statusColor: options.statusColor || "blue", // blue is default color
    clickFunc: options.clickFunc || "",
    imageLabel: options.imageLabel || "",
    data: options.data || null, // reserve this space to pass a product/variant/etc. so you can fully customize webhook sending
    desktopNotification: null,
    read: false,
    isBanner: false,
    timestamp: new Date().getTime(),
    id: window.makeid(10) // assign a new id to each notification
  }
  notifications.push(newNotification);

  // send Discord webhook
  if (window.companionSettings.webhook.enabled) trySendWebhook(newNotification);

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
