'use strict';

const webhookUrl = process.env.slack_webhook_url;
const request = require('request');

module.exports = (event, callback) => {
  request.post(webhookUrl, {
    form: {
      payload: '{"text": "Now is: '+ new Date() +'"}'
    }
  }, (err, response, body) => {
    if (! err) {
      console.log(err);
      return callback(null, { message: 'Slack message sent' })
    } else {
      console.log(err);
      return callback(true, err);
    }
  });
};