// enable some of the new ESx features
'use strict';

// deps
var clui = require('clui');
var spinner = clui.Spinner;

module.exports = {

  ui: {

    progress: function(message) {
      return message ? new spinner(message) : message;
    }

  }

};
