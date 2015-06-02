# grunt-betajs-templates

> Build [BetaJS](http://betajs.com/jsdoc/index.html) templates.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-betajs-templates --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-betajs-templates');
```

## The "betajs_templates" task

### Overview
In your project's Gruntfile, add a section named `betajs_templates` to the data object passed into `grunt.initConfig()`.

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
      }
    },
  },
});
```

## Contributors

- Oliver Friedmann
- Victor Lingenthal
- Matt McNaughton

## License

MIT


## Credits
This software uses modified portions of
- Underscore, MIT Software License, (c) 2009-2013 Jeremy Ashkenas, DocumentCloud

