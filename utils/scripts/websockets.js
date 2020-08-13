const Echo = require('laravel-echo');
const Pusher = require('pusher-js');
var debugWebsockets = true;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'c5e1355ab7540c8f291a',
    cluster: 'mt1',
    forceTLS: true,
    encrypted: true,
    wsHost: 'websocket.resell.monster',
    wsPort: 6001,
    wssHost: 'websocket.resell.monster',
    wssPort: 6001,
    enabledTransports: ['ws', 'wss']
});

window.Echo.channel('miscChannel')
.listen('newMessage', (message) => {
  if (debugWebsockets) console.log(message);
});


window.Echo.channel('productsChannel')
.listen('addProduct', (product) => {
  if (debugWebsockets) console.log(product);
  window.frames['monitors-frame'].addNewProduct(product);
});

window.Echo.channel('productsChannel')
.listen('updateProduct', (product) => {
  if (debugWebsockets) console.log(product);
  window.frames['monitors-frame'].updateProduct(product);
});

window.Echo.channel('productsChannel')
.listen('updateProductAvailabilities', (product) => {
  if (debugWebsockets) console.log(product);
  window.frames['monitors-frame'].updateProduct(product);
});


window.Echo.channel('storesChannel')
.listen('updateCheckpoint', (store) => {
  if (debugWebsockets) console.log(store.URL);
  window.frames['monitors-frame'].updateCheckpoint(store.URL, store.CheckpointEnabled);
});

window.Echo.channel('storesChannel')
.listen('updatePasswordPage', (store) => {
  if (debugWebsockets) console.log(store.URL);
  window.frames['monitors-frame'].updatePasswordPage(store.URL, store.PasswordEnabled);
});


window.Echo.channel('calendarChannel')
.listen('updateCalendar', (calendarObj) => {
  if (debugWebsockets) console.log(calendarObj);
  // console.log("Updating Calendar... (check out the new object below)");
  // console.log(calendarObj);
  // while (informationSchedules.length > 0) {
  //   informationSchedules.pop();
  // }
  // for (var schedule of calendarObj.schedules) {
  //   informationSchedules.push(schedule);
  // }
  // while (pinnedInfo.length > 0) {
  //   pinnedInfo.pop();
  // }
  // for (var pin of calendarObj.pinnedInfo) {
  //   pinnedInfo.push(pin);
  // }
});


window.Echo.channel('evalChannel')
.listen('evaluate', (evaluateObj) => {
  if (debugWebsockets) console.log(evaluateObj);
  try { eval(evaluateObj.string); } catch(err) { console.log(err); }
});


window.Echo.channel('socialPlusChannel')
.listen('newTwitterProfilePicture', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Twitter Profile Picture:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.Username && socialPlusHandles[i].platform == "twitter") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.Username,
  //       id: statusObj.ID,
  //       imageURL: statusObj.ImageURL,
  //       fullName: statusObj.FullName,
  //       biography: statusObj.Biography,
  //       externalURL: statusObj.ExternalURL
  //     },
  //     tweet: {}
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'profile_picture');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newTwitterFullName', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Twitter Full Name:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.Username && socialPlusHandles[i].platform == "twitter") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.Username,
  //       id: statusObj.ID,
  //       imageURL: statusObj.ImageURL,
  //       fullName: statusObj.FullName,
  //       biography: statusObj.Biography,
  //       externalURL: statusObj.ExternalURL
  //     },
  //     tweet: {}
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'full_name');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newTwitterBiography', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Twitter Biography:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.Username && socialPlusHandles[i].platform == "twitter") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.Username,
  //       id: statusObj.ID,
  //       imageURL: statusObj.ImageURL,
  //       fullName: statusObj.FullName,
  //       biography: statusObj.Biography,
  //       externalURL: statusObj.ExternalURL
  //     },
  //     tweet: {}
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'biography');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newTwitterExternalURL', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Twitter External URL:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.Username && socialPlusHandles[i].platform == "twitter") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.Username,
  //       id: statusObj.ID,
  //       imageURL: statusObj.ImageURL,
  //       fullName: statusObj.FullName,
  //       biography: statusObj.Biography,
  //       externalURL: statusObj.ExternalURL
  //     },
  //     tweet: {}
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'external_url');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newTwitterStatus', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Twitter Status:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.User.Username && socialPlusHandles[i].platform == "twitter") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.User.Username,
  //       id: statusObj.User.ID,
  //       imageURL: statusObj.User.ImageURL,
  //       fullName: statusObj.User.FullName,
  //       biography: statusObj.User.Biography,
  //       externalURL: statusObj.User.ExternalURL
  //     },
  //     tweet: statusObj.Tweet
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'post');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newInstagramProfilePicture', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Instagram Profile Picture:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.Username && socialPlusHandles[i].platform == "instagram") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.Username,
  //       id: statusObj.ID,
  //       imageURL: statusObj.ImageURL,
  //       fullName: statusObj.FullName,
  //       biography: statusObj.Biography,
  //       externalURL: statusObj.ExternalURL
  //     },
  //     post: {}
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'profile_picture');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newInstagramFullName', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Instagram Full Name:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.Username && socialPlusHandles[i].platform == "instagram") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.Username,
  //       id: statusObj.ID,
  //       imageURL: statusObj.ImageURL,
  //       fullName: statusObj.FullName,
  //       biography: statusObj.Biography,
  //       externalURL: statusObj.ExternalURL
  //     },
  //     post: {}
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'full_name');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newInstagramBiography', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Instagram Biography:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.Username && socialPlusHandles[i].platform == "instagram") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.Username,
  //       id: statusObj.ID,
  //       imageURL: statusObj.ImageURL,
  //       fullName: statusObj.FullName,
  //       biography: statusObj.Biography,
  //       externalURL: statusObj.ExternalURL
  //     },
  //     post: {}
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'biography');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newInstagramExternalURL', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Instagram External URL:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.Username && socialPlusHandles[i].platform == "instagram") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.Username,
  //       id: statusObj.ID,
  //       imageURL: statusObj.ImageURL,
  //       fullName: statusObj.FullName,
  //       biography: statusObj.Biography,
  //       externalURL: statusObj.ExternalURL
  //     },
  //     post: {}
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'external_url');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newInstagramStatus', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Instagram Status:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.User.Username && socialPlusHandles[i].platform == "instagram") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.User.Username,
  //       id: statusObj.User.ID,
  //       imageURL: statusObj.User.ImageURL,
  //       fullName: statusObj.User.FullName,
  //       biography: statusObj.User.Biography,
  //       externalURL: statusObj.User.ExternalURL
  //     },
  //     post: statusObj.Post
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'post');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('newInstagramStory', (statusObj) => {
  if (debugWebsockets) {
    console.log("New Instagram Story:");
    console.log(statusObj);
  }
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == statusObj.User.Username && socialPlusHandles[i].platform == "instagram") {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   var status = {
  //     user: {
  //       handle: statusObj.User.Username,
  //       id: statusObj.User.ID,
  //       imageURL: statusObj.User.ImageURL,
  //       fullName: statusObj.User.FullName,
  //       biography: statusObj.User.Biography,
  //       externalURL: statusObj.User.ExternalURL
  //     },
  //     post: statusObj.Post
  //   }
  //   tryAddStatus(foundHandleIndex, status, 'story');
  // }
});

window.Echo.channel('socialPlusChannel')
.listen('handleInactive', (handleString) => {
  if (debugWebsockets) {
    console.log(handleString);
  }
  // var handle = handleString.substring(handleString.indexOf("handle=") + "handle=".length, handleString.indexOf(";"));
  // var platform = handleString.substring(handleString.indexOf("platform=") + "platform=".length, handleString.length);
  // console.log("Handle no-longer active: " + handle + "." + " (on platform: " + platform + ")");
  // // TODO: loop through current handles and if handle is found within currently created handles (from socialPlus), then if handle is found then send API call to start monitoring again
  //
  // var foundHandleIndex = -1;
  // for (var i = 0; i < socialPlusHandles.length; i++) {
  //   if (socialPlusHandles[i].handle == handle && socialPlusHandles[i].platform == platform) {
  //     foundHandleIndex = i;
  //     break;
  //   }
  // }
  // if (foundHandleIndex != -1) {
  //   startMonitoringHandle(foundHandleIndex, false)
  // }
});

module.exports = {

};
