'use strict';

const webhookUrl = process.env.slack_webhook_url;
const request = require('request');

const slackAuthorizer = require('./src/authorizer/slackAuthorizer');
const parser = require('./src/service/tokenParser');

module.exports.hello = (event, context, callback) => {
  
  const tokenParser = new parser(event.body);
  const authorizer = new slackAuthorizer(tokenParser.parseToken());
  
  
  if (!authorizer.authorize()) {
    context.done('Unauthorized');
  }
  
  request.post(webhookUrl, {
    form: {
      payload: '{"text": "Now is: '+ new Date() +'"}'
    },
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