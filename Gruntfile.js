var path = require("path");
var fs = require("fs");
var glob = require("glob");
require('shelljs/global');

module.exports = function(grunt) {

  grunt.initConfig({

    exec: {
      compile_handlebars_amd: {
          cmd:''
      },
      compile_handlebars: {
          cmd:''
      }
    },
    watch: {
        handlebars: {
            files: ['**/*.handlebars'],
            tasks: ['exec'],
            options: { spawn: false }
        }
    }
  });
  
  grunt.event.on('watch', function(action, filepath) {
    if(! path.extname(filepath) == '.handlebars' ) return;

    var dir = path.dirname(filepath);
    var files = fs.readdirSync(dir).filter(function(f){
        return path.extname(f) == '.handlebars';
    });
    var cmds = [
        "handlebars "+files.join(' ')+" -a -f templates.amd.js",
        "handlebars "+files.join(' ')+" -f templates.js"
    ];
    grunt.config('exec.compile_handlebars_amd.cmd', cmds[0]);
    grunt.config('exec.compile_handlebars_amd.cwd', dir);
    grunt.config('exec.compile_handlebars.cmd', cmds[1]);
    grunt.config('exec.compile_handlebars.cwd', dir);
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('compile_all_handlebars','compile all handlebar templates',function(){
      var hbsFiles = glob.sync("**/*.handlebars",{nodir:true});

      var hbsDirs = [];
      for(var i=0; i<hbsFiles.length; i++){
          var d = path.dirname(hbsFiles[i]);
          if(hbsDirs.indexOf(d) == -1) hbsDirs.push(d);
      }
      for(var i=0; i<hbsDirs.length; i++){
          var dir = hbsDirs[i];
          var files = fs.readdirSync(dir).filter(function(f){
              return path.extname(f) == '.handlebars';
          });
          pushd(dir);
          exec("handlebars "+files.join(' ')+' -a -f templates.amd.js');
          popd();
      }
  });

  grunt.registerTask('default',['compile_all_handlebars']);

};
