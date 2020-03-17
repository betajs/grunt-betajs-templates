module.exports = function(grunt) {
	
	var Helper = {

		keys: function(obj) {
			var result = [];
			for (var key in obj)
				result.push(key);
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
			if (!this.JS_ESCAPER_REGEX_CACHED)
				this.JS_ESCAPER_REGEX_CACHED = new RegExp(this.keys(this.JS_ESCAPES).join("|"), "g");
	        return this.JS_ESCAPER_REGEX_CACHED;
		},

		jsEscape: function (s) {
			var self = this;
	        return s.replace(this.JS_ESCAPER_REGEX(), function(match) {
	          return "\\" + self.JS_ESCAPES[match];
	        });
		}
		
	};
	
	
	var Parser = {
			
		scriptRegex: /<script\s+type\s*=\s*["']text\/template["']\s+id\s*=\s*["']([^"']*)["']\s*>([\w\W]*?)<\/script>/ig,
			
		addSource: function (json, filepath, source) {
	        source = source.replace(new RegExp("[\n\t\r]", "g"), " ");
	        var done = false;
	        source.replace(this.scriptRegex, function (match, id, content) {
	        	json[id] = content;
	        	done = true;
	        });
	        if (!done) {
	        	var id = filepath;
	        	var idx = id.lastIndexOf("/");
	        	if (idx >= 0)
	        		id = id.substring(idx + 1);
	        	idx = id.indexOf(".");
	        	if (idx >= 0)
	        		id = id.substring(0, idx);
	        	json[id] = source;
	        }
		}
			
	};
	
	
	var Printer = {
		
		printJSON: function (namespace, json) {
			var bases = namespace.split(".");
		    var currentNS = bases[0];
		    var lines = [];
		    lines.push(currentNS + " = " + currentNS + " || {};");
		    for (var i = 1; i < bases.length; ++i) {
		    	currentNS += "." + bases[i];
		    	lines.push(currentNS + " = " + currentNS + " || {};");
		    }
		    lines.push("(function (base, extend) { for (var key in extend) base[key] = extend[key]; }).call(");
		    lines.push("this,");
		    lines.push(namespace + ",");
		    lines.push(JSON.stringify(json));
		    lines.push(");");
		    return lines.join("\n");
		},
		
		printScoped: function (namespace, json) {
			var lines = [];
			lines.push("Scoped.extend('" + namespace + "', function () {");
			lines.push("return " + JSON.stringify(json) + ";");
			lines.push("});");
			return lines.join("\n");
		}
			
	};

	
	grunt.registerMultiTask("betajs_templates", "Converts templates", function() {
		// Return with error if no namespace is specified.
		if (!this.options().namespace) {
			grunt.fail.warn("Please specify options.namespace for this task.");
			return ""; // Even if force is used, the execution will stop here.
		}

		var namespace = this.options().namespace;
		var scoped = !!this.options().scoped;
    
		// For every file group
		this.files.forEach(function(fileGroup) {
			// get a list of all of the files in the file group
			var files = grunt.file.expand({nonull: true}, fileGroup.src);

		    // json is the key-value-object of all processed templates within file group
			var json = {};
			
			files.forEach(function (filepath) {
		        if (!grunt.file.exists(filepath)) {
		            grunt.log.error("Source file '" + filepath + "' not found.");
		            return "";
		        }
		        Parser.addSource(json, filepath, grunt.file.read(filepath));
			});
			
	        // Write new src to fileGroup.dest
	        grunt.file.write(fileGroup.dest, scoped ? Printer.printScoped(namespace, json) : Printer.printJSON(namespace, json));

            // Log successful creation
            grunt.log.writeln("File '" + fileGroup.dest + "' created.");
		});
	});
};

module.exports.concatProcess = function (grunt) {
	var REGEX_COMMENT = /<!--[\s\S]*?-->/g;
	return function (src, filepath) {
        return grunt.template.process(src, {
            data: {
                filepath: filepath,
                dirname: filepath.substring(0, filepath.lastIndexOf("/")),
                parentdirname: filepath.split("/").slice(0, -2).join("/"),
                filepathnoext: filepath.substring(0, filepath.lastIndexOf(".")),
                template: function (filename) {
                	var s = JSON.stringify(grunt.file.read(filename).replace(REGEX_COMMENT, ""));
                    return s.substring(1, s.length - 1);
                },
				template_function_cache: function (filename) {
                    var cache = {};
                    var text = grunt.file.read(filename).replace(REGEX_COMMENT, "");
                    while (text) {
                        var i = text.indexOf("{{");
                        if (i === 0) {
                            i = text.indexOf("}}");
                            while (i + 2 < text.length && text.charAt(i + 2) == "}")
                                i++;
                            if (i >= 0) {
                                i += 2;
                                var s = text.substring(2, i - 2);
								if (s.indexOf("?") === 0)
									s = s.substring(1);
                                if (s.indexOf("*") === 0 || s.indexOf("-") === 0 || s.indexOf("=") === 0)
                                    s = s.substring(1);
								var j = s.lastIndexOf("::");
								if (j >= 0) {
                                    var r = s.substring(j + 2).trim();
                                    cache[r] = r;
                                    s = s.substring(0, j);
                                    j = s.indexOf("~");
                                    if (j >= 0) {
                                        r = s.substring(j + 1).trim();
                                        cache[r] = r;
									}
                                } else {
                                    s = s.trim();
                                    cache[s] = s;
								}
                            } else
                                i = text.length;
                        } else if (i < 0)
                            i = text.length;
                        text = text.substring(i);
                    }
                    var result = [];
                    for (var code in cache)
                        result.push(JSON.stringify(code) + ": " + "function (obj) { with (obj) { return " + code + "; } }");
                    return '*/' + result.join(", ") + '/*';
				}
            }
        });
    };
};
