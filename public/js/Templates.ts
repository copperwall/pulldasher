import * as $ from 'jquery'
import * as _ from 'underscore'

const pullTemplate = require('html/pull.html');
const restoreTemplate = require('html/restore.html');
const columnTemplate = require('html/column.html');
const indicatorTemplate = require('html/indicator.html');
const globalIndicatorTemplate = require('html/global_indicator.html');

var templates = {
   pull: pullTemplate,
   restore: restoreTemplate,
   column: columnTemplate,
   indicator: indicatorTemplate,
   global_indicator: globalIndicatorTemplate
};

var compiledTemplates = {};

export default {
   get: function(name) {
      if (!compiledTemplates[name]) {
         compiledTemplates[name] = _.template(
            templates[name],
            null,
            { variable: name }
         );
      }
      return compiledTemplates[name];
   },
   /**
    * Renders a template with provided data and appends the resulting node
    * to the end of the JQuery object container.
    *
    * @return Returns a jQuery object representing the result of the render.
    */
   renderIntoContainer: function renderInto(template, data, container) {
      var templateFunction = this.get(template);
      var html = templateFunction(data);
      var node = $(html);
      container.append(node);

      return node;
   }
};
