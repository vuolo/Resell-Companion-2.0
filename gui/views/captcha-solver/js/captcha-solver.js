const electron = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

const captchaSolverApp = new Vue({
	el: "#Captcha_Solver",
	data: {
		solverOpened: false,
		host: "resell.monster"
	}
});

const captchaFramePath = path.join(__dirname, '../../../gui/views/captcha-solver/solver-frame.html');

// setupSolverFrame("shop-usa.palaceskateboards.com", "6LeoeSkTAAAAAA9rkZs5oS82l69OEYjKRZAiKdaF");

async function setupSolverFrame(host, sitekey) {
	captchaSolverApp.host = host;
	captchaSolverApp.solverOpened = true;

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
			console.log(captchaResponse);
			// TODO: send captchaResponse to main window for node (get captcha solver index's node)
			closeSolverFrame();
		}
	});
}

function closeSolverFrame() {
	captchaSolverApp.solverOpened = false;
	captchaSolverApp.host = "resell.monster";
}

async function injectCaptchaFrame(webContents, sitekey) {
	await webContents.executeJavaScript(`
		document.write(\`${generateCaptchaFrameHTML(sitekey, "dark")}\`)
		`, true);
}

function generateCaptchaFrameHTML(sitekey, theme) {
	return String(fs.readFileSync(captchaFramePath)).replace(new RegExp("{{CAPTCHA_THEME}}", 'g'), theme).replace(new RegExp("{{CAPTCHA_SITEKEY}}", 'g'), sitekey);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
