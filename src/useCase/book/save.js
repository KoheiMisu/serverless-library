'use strict';

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const bookTable = process.env.bookTable;

const uuidV1 = require('uuid/v1');

const webhookUrl = process.env.slack_webhook_url;
const request = require('request');

const dateTime = require('node-datetime');
const dt = dateTime.create();
const insertDate = dt.format('Y-m-d H:M:S');

const async = require('async');

module.exports = (event, callback) => {
  const key = uuidV1();
  
  async.series([
    function(callback) {
      dynamoDB.put({
        'TableName': bookTable,
        'Item': {
          'id': key,
          'title': 'hoge',
          'insert_date': insertDate,
        },
      }, function(err, data) {
        callback(null, "first");
      });
    },
    function(callback) {
      dynamoDB.get({
        TableName: bookTable,
        Key: {
          id: key,
        },
      }, function(err, data) {
        if (!err) {
          // const content = `*${data.Item.title}* is Saved !!`;
          const response = {
            text: `\`${data.Item.title}\` is Saved !!`,
          };
      
          request.post(webhookUrl, {
            form: {
              payload: JSON.stringify(response),
            },
          }, (err, response, body) => {
            callback(null, 'second');
          });
        }
      });
    },
  ], function(err, results) {
    if (err) {
      throw err;
    }
  });
};