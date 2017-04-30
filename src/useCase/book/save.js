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

const parser = require('../../service/queryParser');

module.exports = (event, callback) => {
  
  const queryParser = new parser(event.body);
  
  const key = uuidV1();
  
  async.series([
    function(callback) {
  
      /**
       * データを保存
       */
      dynamoDB.put({
        'TableName': bookTable,
        'Item': {
          'id': key,
          'title': queryParser.parseText(),
          'insert_date': insertDate,
        },
      }, function(err, data) {
        callback(null, "saved");
      });
    },
    function(callback) {
      
      /**
       * 保存したものを取り出して
       * 結果を返す
       */
      dynamoDB.get({
        TableName: bookTable,
        Key: {
          id: key,
        },
      }, function(err, data) {
        if (!err) {
          const response = {
            text: `\`${data.Item.title}\` is Saved !!`,
          };
  
          /**
           * webhook でチャンネルにメッセージを返す
           */
          request.post(webhookUrl, {
            form: {
              payload: JSON.stringify(response),
            },
          }, (err, response, body) => {
            callback(null, 'getData');
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