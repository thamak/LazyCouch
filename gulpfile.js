/// <binding BeforeBuild='ts-lint, build-app' />
"use strict";


//******************************************************************************
//* Paths
//******************************************************************************
var ProjectPaths = (function () {
	function projectPaths() {
		this.source = 'src/';
		this.sourceApp = this.source + 'app/';
		this.sourceTest = this.source + 'test/';
		
		this.tsOutputPath = this.source + '/js';
		this.allJavaScript = [this.source + '/js/**/*.js'];
		this.allTypeScript = '/**/*.ts';
		this.allAppTypeScript = this.sourceApp + '/**/**.ts';
		this.allAppDeclarationTypeScript = this.sourceApp + '/**/**d.ts';
		this.allTestTypeScript = this.sourceTest + '/**/*.ts';
		
		this.typings = './typings/';
		this.libraryTypeScriptDefinitions = './typings/main/**/*.ts';
	}
	return projectPaths;
})();

var paths = new ProjectPaths();

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************
var gulp = require("gulp"),
	gutil = require("gulp-util"),
	browserify = require("browserify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	tslint = require("gulp-tslint"),
	tsstylish = require('gulp-tslint-stylish'),
	tsc = require("gulp-typescript"),
	sourcemaps = require("gulp-sourcemaps"),
	uglify = require("gulp-uglify"),
	nodemon = require("gulp-nodemon"),
	runSequence = require("run-sequence"),
	mocha = require("gulp-mocha"),
	istanbul = require("gulp-istanbul"),
	babel = require("gulp-babel"),
	browserSync = require('browser-sync').create();


//******************************************************************************
//* LINT
//******************************************************************************
var isLintError = false;
gulp.task('ts-lint', function () {
	return gulp.src(paths.allTypeScript)
				.pipe(tslint({ rulesDirectory: 'node_modules/tslint-microsoft-contrib' }))
				.pipe(tslint.report(tsstylish, {
		emitError: true,
		sort: true,
		bell: true,
		fullPath: true
	}));
});

//******************************************************************************
//* BUILD
//******************************************************************************
var tsProject = tsc.createProject("tsconfig.json");
gulp.task("build-app", function () {
	//gutil.log("./routes" + paths.allTypeScript);
	require("babel-core/register");
	return gulp.src([
		"./app.ts",
		"./routes/" + paths.allTypeScript,
		"./server/" + paths.allTypeScript,
		paths.libraryTypeScriptDefinitions,
		paths.allAppDeclarationTypeScript
	], { base: "./" })
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject))
		//.dts.pipe(gulp.dest(paths.tsOutputPath))
		.js.pipe(babel({ presets: 'es2015' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest("."));
});

var tsTestProject = tsc.createProject("tsconfig.json");
gulp.task("build-test", function () {
	return gulp.src([
		paths.allTestTypeScript,
		paths.libraryTypeScriptDefinitions,
		paths.allAppDeclarationTypeScript
	])
		.pipe(sourcemaps.init())
        .pipe(tsc(tsTestProject))
        .js.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("src/test/"));
});

gulp.task("build", function (cb) {
	runSequence(["build-app", "build-test"], cb);
});

//******************************************************************************
//* TEST
//******************************************************************************
gulp.task("istanbul:hook", function () {
	return gulp.src('src/app/**/*.js')
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["istanbul:hook"], function () {
	// need file .babelrc with "presets": ["es2015"]
	require("babel-core/register");
	return gulp.src('src/test/**/*.test.js')
        .pipe(mocha({
		ui: 'bdd'
	}))
        .pipe(istanbul.writeReports());
});

//******************************************************************************
//* BUNDLE
//******************************************************************************
gulp.task("bundle", function () {
	
	var libraryName = "myapp";
	var mainTsFilePath = "src/app/main.js";
	var outputFolder = "public/javascripts/";
	var outputFileName = libraryName + ".min.js";
	
	var bundler = browserify({
		debug: true,
		standalone : libraryName
	});
	
	return bundler.add(mainTsFilePath)
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputFolder));
});

//******************************************************************************
//* DEV SERVER : need index.html - to configure
//******************************************************************************
gulp.task("launch-browser", ["nodemon"], function () {
	browserSync.init({
		proxy: 'localhost:4000',
		port: 5000
	});
	
	//gulp.watch([paths.allAppTypeScript, paths.allTestTypeScript], ["default"]);
	//gulp.watch("public/*.js").on('change', browserSync.reload);
});

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'app.js', 
		ext: 'ts jade',
		env: { 'NODE_ENV': 'development' }, 
		stdin: false,
		restartable: false,
		tasks: ['default']
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	}).on('restart', function onRestart() {
		// reload connected browsers after a slight delay
		setTimeout(function reload() {
			browserSync.reload({
				stream: false
			});
		}, BROWSER_SYNC_RELOAD_DELAY);
	});
});

//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("default", function (cb) {
	//runSequence("ts-lint", "build", "test", "bundle", cb);
	runSequence("ts-lint", "build-app", cb);
});

//******************************************************************************
//* WATCH
//******************************************************************************
//gulp.task("watch", ["default"], function () {
//	gulp.watch(["src/**/**.ts", "test/**/*.ts"], ["default"]);
//});