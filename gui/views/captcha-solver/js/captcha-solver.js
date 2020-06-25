// imports
const electron = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

// variables
var captchaSettings = {
	captchaNumber: 1,
	language: "en",
	theme: "light",
	solverOpened: false,
	host: "resell.monster",
	sitekey: "",
	nodeID: null,
	mainWebContentsID: null
};

const captchaSolverApp = new Vue({
	el: "#Captcha_Solver",
	data: {
		captchaSettings: captchaSettings
	},
	methods: {
    tryTranslate: window.tryTranslate,
    getThemeColor: window.getThemeColor
	}
});

const captchaFramePath = path.join(__dirname, '../../../gui/views/captcha-solver/solver-frame.html');

async function setupSolverFrame(nodeID, host, sitekey) {
	captchaSettings.host = host;
	captchaSettings.sitekey = sitekey
	captchaSettings.nodeID = nodeID;
	captchaSettings.solverOpened = true;

	// sleep to let webview render and initialize
	await sleep(50);

	const solverFrame = document.querySelector('webview');
	window.solverFrameWebContents = electron.remote.webContents.fromId(solverFrame.getWebContentsId());

	window.solverFrameWebContents.on('dom-ready', async () => {
		// hide page before injection
		window.solverFrameWebContents.insertCSS('body { display: none; }');
		await injectCaptchaFrame(window.solverFrameWebContents, sitekey);
		solverFrame.style.visibility = "visible";
	});
	window.solverFrameWebContents.on('console-message', (event, level, message, line, sourceID) => {
		// MESSAGE TEMPLATE: ${CC} <message>
		if (!message.startsWith("${CC}")) return;
		if (message.includes("CAPTCHA RESPONSE")) {
			let captchaResponse = message.split("${CC} CAPTCHA RESPONSE: ")[1];
			// send captchaResponse to main window using nodeID
			sendCaptchaResponse(nodeID, captchaResponse);
			closeSolverFrame();
		}
	});
}

function closeSolverFrame() {
	captchaSettings.solverOpened = false;
	captchaSettings.host = "resell.monster";
	captchaSettings.sitekey = "";
	captchaSettings.nodeID = null;
}

async function injectCaptchaFrame(webContents, sitekey) {
	await webContents.executeJavaScript(`
		document.write(\`${generateCaptchaFrameHTML(sitekey, captchaSettings.theme)}\`)
		`, true);
}

function generateCaptchaFrameHTML(sitekey, theme) {
	return String(fs.readFileSync(captchaFramePath)).replace(new RegExp("{{CAPTCHA_THEME}}", 'g'), theme).replace(new RegExp("{{CAPTCHA_SITEKEY}}", 'g'), sitekey).replace(new RegExp("{{CAPTCHA_BACKGROUND_COLOR}}", 'g'), window.getThemeColor('rgba(251,247,241,1)', theme));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendCaptchaResponse(nodeID, captchaResponse) {
  electron.remote.webContents.fromId(captchaSettings.mainWebContentsID).send('captchaResponse', { nodeID: nodeID, captchaResponse: captchaResponse });
}

electron.ipcRenderer.on('updateOptions', (event, options) => {
	captchaSettings.mainWebContentsID = options.mainWebContentsID;
	setupSolverFrame(options.nodeID, options.host, options.sitekey);
});

electron.ipcRenderer.on('updateTheme', (event, theme) => {
	captchaSettings.theme = theme;
});

electron.ipcRenderer.on('updateLanguage', (event, language) => {
	captchaSettings.language = language;
});

electron.ipcRenderer.on('updateNumber', (event, number) => {
	captchaSettings.captchaNumber = number;
});
