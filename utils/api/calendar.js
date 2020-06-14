const request = require('request-promise');

async function fetchSchedules() {
  let uri = 'https://resell.monster/api/resell-companion/fetch_schedules';

  const requestOptions = {
    uri: uri,
    simple: false,
    resolveWithFullResponse: true,
    json: true // Automatically parses the JSON string in the response
  };

  const res = await request(requestOptions);
  const body = res.body;

  if (body.status && body.status == 'failed') {
    return false;
  } else {
    return body;
  }

}

module.exports = {
  fetchSchedules: fetchSchedules
};
