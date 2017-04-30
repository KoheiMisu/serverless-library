'use strict';

const slackAuthorizer = require('../authorizer/slackAuthorizer');
const parser = require('../service/queryParser');

const bookSave = require('../useCase/book/save.js');

module.exports.book = (event, context, callback) => {
  const queryParser = new parser(event.body);
  const authorizer = new slackAuthorizer(queryParser.parseToken());
  
  /**
   * 認証
   */
  if (!authorizer.authorize()) {
    context.done('Unauthorized');
  }
  
  /**
   * @Todo ここでlambda functionの振り分けを行いたい
   */
  bookSave(event, (error, result) => {});
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'ok',
    }),
  };
  
  callback(null, response);
};
