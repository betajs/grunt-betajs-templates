/*
 * grunt-betajs-templates
 * https://github.com/betajs/grunt-betajs-templates
 *
 * Copyright (c) 2015 Oliver Friedmann
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {
  grunt.registerMultiTask("betajs_templates", "Converts templates", function() {
    var Helper = {
      keys: function(obj) {
        var result = [];

        for (var key in obj) {
          result.push(key);
        }

        return result;
      },

      JS_ESCAPES: {
        "'":      "'",
        "\\":     "\\",
        "\r":     "r",
        "\n":     "n",
        "\t":     "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
      },

      JS_ESCAPER_REGEX: function () {
        if (!this.JS_ESCAPER_REGEX_CACHED) {
          this.JS_ESCAPER_REGEX_CACHED = new RegExp(this.keys(this.JS_ESCAPES).join("|"), "g");
        }

        return this.JS_ESCAPER_REGEX_CACHED;
      },

      jsEscape: function (s) {
        var self = this;

        return s.replace(this.JS_ESCAPER_REGEX(), function(match) {
          return "\\" + self.JS_ESCAPES[match];
        });
      }
    };

    var namespace = this.options({namespace: "BetaJS.Templates.Cached"}).namespace;

    var scriptRegex = /<script\s+type\s*=\s*["']text\/template["']\s+id\s*=\s*["']([^"']*)["']\s*>([\w\W]*?)<\/script>/ig;

    // For every file group
    this.files.forEach(function(fileObj) {
      // get a list of all of the files in the file group
      var files = grunt.file.expand({nonull: true}, fileObj.src);

      // create header for concattenated templates file
      var src = namespace + " = " + namespace + " || {};\n";

      // src is the concatenation of all processed templates within file group
      src += files.map(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.error("Source file '" + filepath + "' not found.");
          return "";
        }

        // get the source code of the template to be processed
        var source = grunt.file.read(filepath);

        // process template
        source = source.replace(new RegExp("[\n\t\r]", "g"), " ");
        var result = "";
        source.replace(scriptRegex, function (match, id, content) {
          result += namespace + "['" + id + "'] = '" + Helper.jsEscape(content) + "';\n";
        });

        // return processed template
        return result;
      }).join("\n");

      // Write new src to fileObj.dest
      grunt.file.write(fileObj.dest, src);

      // Log successful creation
      grunt.log.writeln("File '" + fileObj.dest + "' created.");
    });
  });
};
