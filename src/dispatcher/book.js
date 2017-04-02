'use strict';

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

const lambda = new AWS.Lambda();
const bookTable = process.env.bookTable;

const slackAuthorizer = require('../authorizer/slackAuthorizer');
const parser = require('../service/queryParser');

const bookSave = require('../useCase/book/save.js');

module.exports.book = (event, context, callback) => {
  const queryParser = new parser(event.body);
  const authorizer = new slackAuthorizer(queryParser.parseToken());
  
  
  // if (!authorizer.authorize()) {
  //   context.done('Unauthorized');
  // }
  
  bookSave(event, (error, result) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};
