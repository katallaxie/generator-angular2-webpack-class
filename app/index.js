// enable some of the new ESx features
'use strict';

// deps
var _ = require('lodash');
var chalk = require('chalk');
var path = require('path');
var s = require('underscore.string');
var yeoman = require('yeoman-generator');
var process = require('process');
var yosay = require('yosay');
var helpers = require('./helpers');
var remote = require('yeoman-remote');
var rimraf = require('rimraf');

// settings
var config = {
  tar: 'https://github.com/AngularClass/angular2-webpack-starter/archive/master.tar.gz',
  npm: {
    loglevel: 'silent',
    progress: false
  }
};

// extending lodash with underscore.string methods
_.mixin(s.exports());

// use the base class of yeoman, and constuct ours generator
module.exports = yeoman.Base.extend({

  // generator constructor
  constructor: function () {

    yeoman.Base.apply(this, arguments);
    // add option to skip install

    // have appname as command parameter
    this.argument('appname', {
      type: String,
      defaults: path.basename(process.cwd())
    });

    // use the cache
    this.option('cache');

  },

  // this is the initializer method of the generator
  initializing: function () {

    // async
    var done = this.async();

    if (!this.options.cache) {
      // new counter
      var counter = helpers.ui.progress('Cleaning cache ...');
      counter.start();

      // we would the defaults here

      rimraf(remote.cacheRoot(), {}, function () {
        counter.stop();
        done();
      }.bind(this));
    } else {
      done();
    }

  },

  // this property gets called by yeoman
  prompting: function () {

    // say yo!
    this.log(yosay('\'Greetings\'! Angular 2 Starter kit featuring Angular 2 inspired by @AngularClass'));

    // promptings
    var prompts = [{
      type: 'input',
      name: 'app',
      message: `What is the name of your fun new app?`,
      default: this.appname,
      store: true
    }, {
        type: 'input',
        name: 'description',
        message: `What is your great new app doing?`,
        default: `Something really, really great ...`,
        store: true
      }, {
        type: 'input',
        name: 'name',
        message: `What is your name?`,
        default: this.user.git.name(),
        store: true
      }, {
        type: 'input',
        name: 'email',
        message: `What is your email?`,
        default: this.user.git.email(),
        store: true
      }];

    // async
    return this.prompt(prompts).then(function (answers) {
      this.answers = answers;
      this.answers.appname = _.camelize(_.slugify(_.humanize(this.answers.app)));
    }.bind(this));

  },

  // configure before proceeding to setup
  configuring: function () { },

  // writing the files to folder
  writing: function () {

    // async
    var done = this.async();

    // new counter
    var counter = helpers.ui.progress('Staging \'Angular2 Webpack Starter\' Template ...');
    counter.start();

    // download tarball
    remote(config.tar, function (err, cached) {
      // we have a different root for the sources
      this.sourceRoot(path.join(cached));

      counter.stop();

      this.fs.copy(
        this.templatePath('**/*'),
        this.destinationPath(''),
        {
          globOptions: {
            dot: true
          }
        }
      );

      done();
    }.bind(this));

  },

  // ok, not really necessary
  default() {

    // compose here with others Yeoman generator

  },

  // post-setup
  install: function () {

    var pkg = require(this.destinationPath('package.json'));

    pkg = _.merge(pkg, {
      author: {
        name: this.answers.name,
        email: this.answers.email
      },
      bugs: {
        url: ''
      },
      description: this.answers.description,
      homepage: '',
      repository: {
        type: 'git',
        url: ''
      },
      version: '0.0.1',
    });

    this.write(this.destinationPath('package.json'), JSON.stringify(pkg, null, 2));

    // npm
    if (!this.options['skip-install']) {
      // new counter
      var cl = console.log;
      console.log = function () { };

      var counter = helpers.ui.progress('Installing toolkit via npm ...');
      counter.start();

      this.npmInstall(undefined, config.npm, function () {
        console.log = cl;
        counter.stop();
      });
    }

  },

  // happy end
  end: function () {

    // saving config
    this.config.save();

    // in case you wanted to skip install
    if (this.options['skip-install']) {
      this.log(['\nPlease have ', chalk.yellow.bold('npm install'), ' run. ',
        'Afterwards run ', chalk.yellow.bold('npm run server:dev:hmr'), '.'
      ].join(''));
    }

  }

});
