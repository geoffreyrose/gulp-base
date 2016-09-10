## Prerequisites

1. Make sure you have NodeJS and NPM Updated/Installed [https://nodejs.org/en/](https://nodejs.org/en/)
2. Make sure the `ruby sass gem` is intalled [http://sass-lang.com/install](http://sass-lang.com/install)
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

Below are the tasks that I have included in the `gulpfile.js` and what they do.

### Gulp styles

Complies your `.scss` files and uses autoprefixer, so there is no need to use any prefixes.
	- currently set to `browsers: ['last 2 versions', 'ie >= 9']`, change as need in `gulpfile.js`

Saves to `assets/css`

To use, run `gulp styles`

### Gulp iestyles

Complies an iestyles.css
	- sames as above

Saves to `assets/css`

To use, run `gulp iestyles`	

### Gulp scripts

Minifies JavaScript and runs through `babel` to compile your `ES2015` JavaScript you may use.

Saves to `assets/js`

To use, run `gulp scripts`	

### Gulp bower-files

Goes through and complies/minify your bower components and moves them to a `lib` folder inside of `assets`
	- most likely you will need to add "overrides" in your bower.json (see the bower.json in this repo for an example)

To use, run `gulp bower-files`

### Gulp images

Compress Images and saves to `assets/img`

To use, run `gulp images`


### Gulp watch

Creates a Proxy and will run the tasks to compile/minify your scss, js and compress your images.
	- you will need to update the proxy url in you `gulpfiles.js`

Also will reload the page when you change `.php` or `.html` files  

To use, run `gulp watch`

### Gulp clean

Removes files from the assets folder
	`assets/css`, `assets/js`, `assets/img`

To use, run `gulp clean`

### Gulp default

Runs `gulp styles`, `gulp scripts`, `gulp images`, and `gulp bower-files`

To use, run `gulp`	
