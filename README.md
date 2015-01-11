# hulkster
[![Build Status](https://travis-ci.org/neoziro/hulkster.svg?branch=master)](https://travis-ci.org/neoziro/hulkster)
[![Dependency Status](https://david-dm.org/neoziro/hulkster.svg?theme=shields.io)](https://david-dm.org/neoziro/hulkster)
[![devDependency Status](https://david-dm.org/neoziro/hulkster/dev-status.svg?theme=shields.io)](https://david-dm.org/neoziro/hulkster#info=devDependencies)

Hulkster is a tool (command line + node) to compile [hogan.js](http://twitter.github.com/hogan.js/) templates. Hogan.js has a similar tool named "hulk", but it is too simple to meet the majority of use cases. So hulkster is a kind of super "hulk".

## Example

````
hulkster template.mustache
````

## Installing

````
npm install hulkster
````

## Usage

````
Precompile hogan templates.
Usage: hulkster [options] -- templates..

Options:
  --version                        Show version
  -o, --output                     Output file                               [string]
  -f, --format                     Output format ("json", "js")              [string]  [default: "js"]
  -v, --export-var, --exportVar    Export variable used in JS output         [string]
  -h, --hogan-var, --hoganVar      Hogan variable used in JS output          [string]
  -a, --amd                        Export using AMD style (require.js)       [boolean]
  -n, --amd-name, --amdName        AMD module name used in define wrapper    [string]
  -p, --hogan-path, --hoganPath    Path of hogan (only valid for amd style)  [string]
  -m, --minify                     Minify output                             [string]
  -t, --minify-html, --minifyHtml  Minify HTML                               [string]
````

### Use wildcards

Thanks to [node-glob](https://github.com/isaacs/node-glob), it's possible to use wildcards in files.

## Use in node

````javascript
var hulkster = require('hulkster');

hulkster.compile('template.mustache', {
	minify: 'true'
});
````

###hulkster.compile(files, options)

* `files` can be a `string` or an `array` of files.
* `options` is an `object` that accepts options defined in usage (with camel syntax).

As in command line, it's possible to use wildcards.

## License

MIT
