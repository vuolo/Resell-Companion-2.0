const DiscordRPC = require('discord-rpc');
const clientId = '650143587513663490';

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setRichPresenceActivity(state = null) {
  if (!rpc) {
    return;
  }

  rpc.setActivity({
    state: state,
    startTimestamp,
    largeImageKey: 'icon',
    largeImageText: `Kuri (${appVersion})`,
    instance: false
  });

  actualState = state;
}

var actualState = null;
var curAwaitState = "Examining the release calendar...";

rpc.on('ready', () => {
  setRichPresenceActivity(curAwaitState);

  // activity can only be set every 15 seconds
  setInterval(() => {
    if (curAwaitState != actualState) {
      setRichPresenceActivity(curAwaitState);
    }
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);
