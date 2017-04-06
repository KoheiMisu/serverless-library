'use strict';

const queryStringParser = require('query-string');

module.exports = class queryParser {
  
  constructor (queryString) {
    this.queryString = queryString;
  }
  
  parseToken () {
    return queryStringParser.parse(this.queryString).token;
  }
  
  parseDispatchMethod () {
    return ;
  }
  
  parseParam () {
    return ;
  }
};