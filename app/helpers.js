// enable some of the new ESx features
'use strict';

// deps
var clui = require('clui');
var Spinner = clui.Spinner;
var Promise = require('promise');

module.exports = {

  ui: {

    progress: function (message) {
      return message ? new Spinner(message) : message;
    }

  },

  tools: {

    npm: function (command, npmArgs, options/*, npm*/) {
      var lib;
      if (arguments.length === 4) {
        lib = arguments[3];
      } else {
        lib = require('npm');
      }

      var load = Promise.denodeify(lib.load);

      return load(options)
        .then(function () {
          // if install is denodeified outside load.then(),
          // it throws "Call npm.load(config, cb) before using this command."
          var operation = Promise.denodeify(lib.commands[command]);

          return operation(npmArgs || []);
        });
    }

  }

};
