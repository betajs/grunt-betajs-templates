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