const request = require('request-promise');
const memory = require('.././memory');

function getLoginTemplate() {
  const loginTemplate = {
    stripe_information: null,
    access_token: '',
    refresh_token: '',
    discord: {
      id: '',
      username: '',
      email: '',
      discriminator: '',
      avatar: ''
    },
    firstLogin: true
  };
  return loginTemplate;
}

async function isCodeValid(code) {
  const uri = `https://resell.monster/companion-login?code=${code}`;

  const requestOptions = {
    uri: uri,
    simple: false,
    resolveWithFullResponse: true,
    json: true // Automatically parses the JSON string in the response
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') {
    // throw new Error("Could not validate authentication code.");
    return false;
  } else {
    let outLogin = getLoginTemplate();
    outLogin.stripe_information = body.stripe_information;
    outLogin.access_token = body.access_token;
    outLogin.refresh_token = body.refresh_token;
    outLogin.discord.id = body.id;
    outLogin.discord.username = body.username;
    outLogin.discord.email = body.email;
    outLogin.discord.discriminator = body.discriminator;
    outLogin.discord.avatar = body.avatar;
    return outLogin;
  }

}

async function isLoginValid(inLogin) {
  if (inLogin.code) {
    inLogin = await isCodeValid(inLogin.code);
  }
  if (!inLogin.refresh_token || inLogin.refresh_token.length == 0) {
    // throw new Error("Could not find a refresh token.");
    return false;
  } else if (!inLogin.stripe_information && false) { // TODO: check for stripe information (YOU NEED TO return stripe information from api call)
    // throw new Error("Could not find stripe Stripe information.");
    return false;
  }
  const uri = `https://resell.monster/companion-login?token=${inLogin.access_token}&refresh_token=${inLogin.refresh_token}`;

  const requestOptions = {
    uri: uri,
    simple: false,
    resolveWithFullResponse: true,
    json: true // Automatically parses the JSON string in the response
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') {
    // throw new Error("Your authorization token has expired.");
    // TODO: parse error from body.error
    return false;
  } else {
    let outLogin = getLoginTemplate();
    outLogin.stripe_information = body.stripe_information;
    outLogin.access_token = body.access_token;
    outLogin.refresh_token = body.refresh_token;
    outLogin.discord.id = body.id;
    outLogin.discord.username = body.username;
    outLogin.discord.email = body.email;
    outLogin.discord.discriminator = body.discriminator;
    outLogin.discord.avatar = body.avatar;
    if (await memory.saveToDatabase("authorization", outLogin)) {
      return outLogin;
    }
    return false;
  }
}

async function logout() {
  if (await memory.saveToDatabase("authorization", getLoginTemplate())) {
    return true;
  }
  return false;
}

async function getCurLogin() {
  let outLogin = await memory.getFromDatabase("authorization") || getLoginTemplate();
  return outLogin;
}

module.exports = {
  getCurLogin: getCurLogin,
  logout: logout,
  isLoginValid: isLoginValid,
  getLoginTemplate: getLoginTemplate
};
