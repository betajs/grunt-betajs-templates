module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile/grunt.js');

	gruntHelper.init(pkg, grunt);

	gruntHelper.config.clean = { tests: ['tmp'] };
	gruntHelper.config.nodeunit = { tests: ['test/*_test.js'] };
	gruntHelper.config.betajs_templates = {
      dest: {
          files: {
            'tmp/expected.js': [
              'test/fixtures/*.html'
            ]
          },
          options: {
            namespace: 'App.Templates'
          }
        },
        newNamespace: {
          files: {
            'tmp/newNamespace.js': [
              'test/fixtures/*.html'
            ]
          },
          options: {
            namespace: 'App.NewNamespace'
          }
        },
        noNamespace: {
          files: {
            'tmp/noNamespace.js': [
              'test/fixtures/*.html'
            ]
          }
        }
	};

	gruntHelper
	.lintTask(null, ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'])
	
    /* External Configurations */
    .codeclimateTask(null, ["tasks"])
    
    /* Package */
    .packageTask()
    
    /* Markdown Files */
	.readmeTask()
    .licenseTask()
    .autoincreasepackageTask(null, "package-source.json")
    
    .docsTask();

	grunt.initConfig(gruntHelper.config);	

	grunt.registerTask('default', ['autoincreasepackage', 'package', 'lint', 'readme', 'license', 'codeclimate', /*'docs',*/ 'test']);
	
	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-continue');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result. grunt-continue is used to test
    // betajs_templates:noNamespace which exits with a failure. Continuing allows
    // writing tests to ensure the `noNamespace.js` file was not created.
    grunt.registerTask('test', [
	    'clean',
	    'betajs_templates:dest',
	    'betajs_templates:newNamespace',
	    'continue:on',
	    'betajs_templates:noNamespace',
	    'continue:off',
	    'nodeunit'
    ]);

};
