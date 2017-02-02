## Prerequisites

1. Make sure you have NodeJS and NPM Updated/Installed [https://nodejs.org/en/](https://nodejs.org/en/)
2. Make sure the `ruby sass gem` is installed [http://sass-lang.com/install](http://sass-lang.com/install)
3. Install gulp globally `npm install -g gulp`

## Setup

1. Download the repo or make sure to update/create your `package.json` file and if you are using Bower, your `bower.json` file.
2. I also included a `.babelrc` file (make sure you have this file), which is used by the "babel" npm package, which is needed for compiling JavaScript written in ES2015.
	- You will need this if you are using Foundation 6.2 or later (or if you are using any JavaScript written in ES2015)
	- If you are not using either of these, there is nothing to worry about, your JavaScript will compile just the same.
3. Install project dependencies. Navigate to project (in terminal) and run `npm install` and `bower install`
	- This will install any dependences in your `package.json` and `bower.json`.

Everything is now ready to use.

## Gulp Tasks

Below are the tasks that are included in the `gulpfile.js` and what they do.

### Gulp styles

Complies `styles.scss` and uses autoprefixer, so there is no need to use any prefixes in your source files.
	- Currently set to `browsers: ['last 2 versions', 'ie >= 9']`, change as need in `gulpfile.js`
	- To compile a different file, update `gulpfile.js`
	- If you are not using `Zurb's Foundation` with bower, remove `bower_components/foundation-sites/scss` from `sassPaths` array in `gulpfile.js`
		- Additionally if you are referencing any `scss` files inside of `styles.scss` located outside of `src` folder or other `bower_components/*` scss files, it may be easier to include the path in `sassPaths` array.

This task also includes code to compile a `iestyle.css` if you need it.
	- This is commented out by default, uncomment to include in this task

Saves to `assets/css/styles.css`
Saves to `assets/css/iestyles.css`

To use, run `gulp styles`


### Gulp scripts

Runs through `js-hint`, then runs through `babel` (to compile any `ES2015` JavaScript you may use), then minifies your JavaScript

Saves to `assets/js/[file-name].min.js`

To use, run `gulp scripts`

### Gulp bower-files

Goes through and complies/minify your bower components  `.js` files and moves them to a `assets/lib`
	- This will also filter any `.png`, `.jpg`, `.gif` inside of the `assets/img/[package-name]` folder
	- Most likely you will need to add "overrides" in your bower.json (see the bower.json in this repo for an example)

To use, run `gulp bower-files`

### Gulp images

Compress Images and saves to `assets/img`

To use, run `gulp images`


### Gulp watch

Creates a Proxy and will run the tasks to compile/minify your scss, js and compress your images.
	- You will need to update the proxy url in your `gulpfiles.js`

This task is configured to reload the page when you change `.php` or `.html` files
	- Update as needed in `gulpfile.js`

To use, run `gulp watch`

### Gulp clean

Removes files from the assets folder
	`assets/css`, `assets/js`, `assets/img`

To use, run `gulp clean`

### Gulp default

Runs `gulp styles`, `gulp scripts`, `gulp images`, and `gulp bower-files`

To use, run `gulp`
