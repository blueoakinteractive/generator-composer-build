'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var shell = require('shelljs');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
        'Welcome to the ' + chalk.red('BlueOak Composer Build') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter your project name?',
        default: process.cwd().split("/").pop()
      },
      {
        type: 'input',
        name: 'hostingProvider',
        message: 'Enter the name of the hosting provider (ie: blueoak, pantheon, platform, acquia, etc...)',
        store: true,
        default: 'blueoak'
      }
    ];
    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  buildGenerate: function() {
    var done = this.async();

    // Drush build generation prompts.
    this.prompt({
      type: 'confirm',
      name: 'buildGenerate',
      message: 'Would you like to generate a project.make.yml from an existing project?',
      default: false
    }, function(props) {
      this.buildGenerate = props.buildGenerate;
      if (!this.buildGenerate) {
        done();
      }
      else {
        var buildGeneragePrompts = [
          {
            type: 'input',
            name: 'aliasName',
            message: 'Enter a drush alias name.',
            store: true,
            default: process.cwd().split("/").pop().split(".").shift() + '._local'
          }
        ];
        this.prompt(buildGeneragePrompts, function (props) {
          this.props.buildGenerate = props;
          done();
        }.bind(this));
      }
    }.bind(this));
  },

  writing: {
    app: function () {
      // Get current user directory.
      var userDir = process.env.HOME + '/';

      // Copy hosting provider specific build files.
      this.fs.copyTpl(
          this.templatePath(this.props.hostingProvider + '/*'),
          this.destinationPath(''),
          {
            projectName: this.props.projectName
          }
      );
      this.fs.copyTpl(
          this.templatePath(this.props.hostingProvider + '/*/**'),
          this.destinationPath(''),
          {
            projectName: this.props.projectName
          }
      );

      // Copy hosting provider specific hidden build files.
      this.fs.copyTpl(
          this.templatePath(this.props.hostingProvider + '/.*'),
          this.destinationPath(''),
          {
            projectName: this.props.projectName
          }
      );
      this.fs.copyTpl(
          this.templatePath(this.props.hostingProvider + '/.*/**'),
          this.destinationPath(''),
          {
            projectName: this.props.projectName
          }
      );

      // Generate project.make.yml based on user input.
      if (this.buildGenerate) {
        shell.exec('drush @' + this.props.buildGenerate.aliasName + ' make-generate ' + process.cwd() + '/project.make.yml');
      }

    }
  },

  complete: function () {
    this.log('The BlueOak Composer Build Generator has finished building your project.');
  }
});
