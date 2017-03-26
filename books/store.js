'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();
const bookTable = process.env.bookTable;

//Generate and return a RFC4122 v1 (timestamp-based) UUID.
const uuidV1 = require('uuid/v1');

//Generate and return a RFC4122 v4 (random) UUID.
// const uuidV4 = require('uuid/v4');

module.exports.store = (event, context, callback) => {
  
  dynamo.scan({
    'TableName': bookTable
  }, function(err, data){
    console.log(JSON.stringify(data));
  });
  
  documentClient.put( {
    'TableName': bookTable,
    "Item": {
      "id": uuidV1(),
      "title": "hello"
    }
  }, function(err, data) {
    console.log(err);
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'ok',
      input: event,
    }),
  };

  callback(null, response);
};
