// enable some of the new ESx features
'use strict';

// deps
var _ = require('lodash');
var chalk = require('chalk');
var git = require('gitconfiglocal');
var path = require('path');
var s = require('underscore.string');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

// settings
var config = {
  npm: {
    loglevel: 'error'
  }
};

// extending lodash with underscore.string methods
_.mixin(s.exports());

// use the base class of yeoman, and constuct ours generator
module.exports = yeoman.Base.extend({

  // generator constructor
  constructor: function() {
    yeoman.Base.apply(this, arguments);
    // add option to skip install

    // have appname as command parameter
    this.argument('appname', {
      type: String,
      defaults: path.basename(process.cwd())
    });

    // read the local git config, as so it it `git init`
    git('./', (err, cfg) => {
      this.git = ! err && cfg.remote ? cfg.remote.origin.url : 'https://';
    });

  },

  // this is the initializer method of the generator
  initializing: function() {

    // we have a different root for the sources
    this.sourceRoot(path.join(__dirname, '../template'));

    // we would the defaults here

  },

  // this property gets called by yeoman
  prompting: function() {

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
    }, {
      type: 'input',
      name: 'git',
      message: `What is the uri of your git?`,
      default: this.git,
      store: true
    }];

    // async
    return this.prompt(prompts).then(function(answers) {
      this.answers = answers;
      this.answers.appname = _.camelize(_.slugify(_.humanize(this.answers.app)));
    }.bind(this));

  },

  // configure before proceeding to setup
  configuring: function() {},

  // writing the files to folder
  writing: function() {

    // copy everything
    this.fs.copy(
  	  this.templatePath('**/*'),
      this.destinationPath(''),
      {globOptions: {
        dot: true,
        ignore: ['**/.git']
      } }
    );

  },

  // ok, not really necessary
  default () {

    // compose here with others Yeoman generator

  },

  // post-setup
  installing: function() {

    // npm
    if (!this.options['skip-install']) {
      this.runInstall('npm', '', config.npm);
    }

  },

  // happy end
  end: function() {

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
