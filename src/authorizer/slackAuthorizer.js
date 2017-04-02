'use strict';

module.exports = class slackAuthorizer {
  
  constructor (token) {
    this.slashCommandToken = process.env.slash_command_token;
    this.requestToken = token;
  }
  
  authorize () {
    if (this.requestToken == this.slashCommandToken) {
      return true;
    }
    
    return false;
  }
};