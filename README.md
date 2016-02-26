# grunt-betajs-templates 0.1.9
[![Code Climate](https://codeclimate.com/github/betajs/grunt-betajs-templates/badges/gpa.svg)](https://codeclimate.com/github/betajs/grunt-betajs-templates)
[![npm version](https://img.shields.io/npm/v/grunt-betajs-templates.svg?style=flat)](https://www.npmjs.com/package/grunt-betajs-templates)

Build BetaJS templates.



## Getting Started


This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-betajs-templates --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-betajs-templates');
```




## Basic Usage


#### Overview
In your project's Gruntfile, add a section named `betajs_templates` to the data object passed into `grunt.initConfig()`.

#### Options
The namespace of each `betajs_templates` namespace **must** be specified. See
any of the examples for guidance on specifying the namespace option.

```js
grunt.initConfig({
  betajs_templates: {
    dist: {
      files: {
        "dest/betajs-templates.js": [
          "src/my_first_template.html",
          "src/my_second_template.html",
          "src/my_last_templates.html"
        ]
      },
      options: {
        namespace: 'App.Templates'
      }
    },
  },
});
```

Naturally, it is possible to specify a different namespace for each subtask.
Multiple namespaces for different subtasks can be seen in the example below.

```js
grunt.initConfig({
  betajs_templates: {
    dashboard: {
      files: {
        "dest/betajs-dashboard-templates.js": [
          "dashboard/*.html",
        ]
      },
      options: {
        namespace: 'App.Dashboard'
      }
    },
    homepage: {
      files: {
        "dest/betajs-homepage-templates.js": [
          "homepage/*.html"
        ]
      },
      options: {
        namespace: 'App.Homepage'
      }
    }
  }
});
```


## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [https://github.com/betajs/grunt-betajs-templates](https://github.com/betajs/grunt-betajs-templates) |
| Git        | [git://github.com/betajs/grunt-betajs-templates.git](git://github.com/betajs/grunt-betajs-templates.git) |
| Repository | [http://github.com/betajs/grunt-betajs-templates](http://github.com/betajs/grunt-betajs-templates) |
| Blog       | [http://blog.betajs.com](http://blog.betajs.com) | 
| Twitter    | [http://twitter.com/thebetajs](http://twitter.com/thebetajs) | 



## Compatability
| Target | Versions |
| :----- | -------: |
| NodeJS | 0.10 - Latest |






## Contributors

- Oliver Friedmann
- Victor Lingenthal
- Matt McNaughton


## License

Apache-2.0


## Credits

This software may include modified and unmodified portions of:
- Underscore, MIT Software License, (c) 2009-2013 Jeremy Ashkenas, DocumentCloud
