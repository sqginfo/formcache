module.exports = function (grunt) {

  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    banner: "/*!\n" +
            " * <%= pkg.name %> v<%= pkg.version %>\n" +
            " * <%= pkg.homepage %>\n" +
            " *\n" +
            " * Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
            " * Released under the <%= pkg.license.type %> license\n" +
            " */\n",
    clean: {
      dist: ["dist"],
      build: ["build/<%= pkg.version %>.<%= grunt.template.today('yyyymmdd') %>"],
      release: ["releases/<%= pkg.version %>"],
      docs: ["docs/dist"]
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      files: ["*.js", "src/*.js"]
    },
    jscs: {
      options: {
        config: ".jscsrc"
      },
      files: ["*.js", "src/*.js"]
    },
    uglify: {
      dist: {
        src: "src/<%= pkg.name %>.js",
        dest: "dist/<%= pkg.name %>.min.js"
      }
    },
    usebanner: {
      options: {
        position: "top",
        banner: "<%= banner %>"
      },
      files: ["dist/*.js"]
    },
    copy: {
      dist: {
        expand: true,
        cwd: "src",
        src: "**",
        dest: "dist",
        filter: "isFile"
      },
      build: {
        expand: true,
        cwd: "dist",
        src: "**",
        dest: "build/<%= pkg.version %>.<%= grunt.template.today('yyyymmdd') %>",
        filter: "isFile"
      },
      release: {
        expand: true,
        cwd: "dist",
        src: "**",
        dest: "releases/<%= pkg.version %>",
        filter: "isFile"
      },
      docs: {
        expand: true,
        cwd: "dist/",
        src: "*.js",
        dest: "docs/dist/",
        filter: "isFile"
      },
      others: {
        src: "README.md",
        dest: "docs/"
      }
    },
    watch: {
      files: [
        "src/<%= pkg.name %>.js"
      ],
      tasks: "jshint"
    }
  });

  // Loading dependencies
  require("load-grunt-tasks")(grunt);

  grunt.registerTask("build", ["clean:build", "copy:build"]);
  grunt.registerTask("release", ["clean:release", "copy:release"]);
  grunt.registerTask("docs", ["clean:docs", "copy:docs", "copy:others"]);
  grunt.registerTask("default", ["clean:dist", "jshint", "jscs", "uglify", "copy:dist", "usebanner", "build", "release", "docs"]);
};
