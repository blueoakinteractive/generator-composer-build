'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
        'Welcome to the ' + chalk.red('BlueOak Composer Build') + ' generator!'
    ));

    var prompts = [{
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
      }];
    this.prompt(prompts, function (props) {
      this.props = props;
      done();
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

    }
  },

  complete: function () {
    this.log('The BlueOak Composer Build Generator has finished building your project.');
  }
});
