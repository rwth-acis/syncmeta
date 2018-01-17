'use strict';

module.exports = function(grunt) {

    var _ = grunt.util._,
        path = require('path');

    grunt.registerMultiTask('buildwidgets', 'Simple template engine for the generation of widget code', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            partials: "partials",
            data: {
                meta: {
                    title: "No title specified",
                    description: "No description specified"
                },
                bodyPartial: null
            }
        });

        var templateUtilFunctions = {
            partial: function(partial,data){
                var filepath, tmpl;

                if(partial === null || partial === "") return "";

                filepath = path.join(options.partials,partial);

                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Partial file "' + filepath + '" not found.');
                    return "";
                } else {
                    tmpl = grunt.file.read(filepath);
                    return grunt.template.process(tmpl,_.extend(templateUtilFunctions,data)).replace(/(^(\r\n|\n|\r)*)|((\r\n|\n|\r)*$)/g,"");
                }
                
            }
        };

        var templateData = _.extend(options.data,templateUtilFunctions);
        
        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            var output = "";

            f.src.filter(function(filepath) {

                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
              var tmpl = grunt.file.read(filepath);
              output += grunt.template.process(tmpl, {data: templateData});
            });

          grunt.file.write(f.dest, output);
          grunt.log.writeln('Generated \'' + f.dest + '\'');

        });


    });

};
