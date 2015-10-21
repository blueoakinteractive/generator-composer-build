'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({

  // Build project folder from template
  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('project'),
        this.destinationPath('project/')
      );
    }
  },

  // Display completion message
  complete: function () {
    this.log('The BlueOI Drupal Project Make Generator has finished building your project.');
  }

});
