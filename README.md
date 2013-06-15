# Hulkster [![Build Status](https://travis-ci.org/neoziro/hulkster.png?branch=master)](https://travis-ci.org/neoziro/hulkster)

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

## Release Notes

0.0.7:

* Add '--version' in options.

0.0.6:

* Fixes a bug in HTML minification with mustache tag in attribute values.

0.0.5:

* Enable removeComments option in HTML minifier.

0.0.4:

* Fixes a bug in HTML minification (Issue #1).

0.0.3:

* Update package.json to use tilde version range instead of unsecure '*'.

0.0.2:

* Add HTML minification option.

0.0.1: 
 
* First version of hulkster, it do the job ! And there is some tests :)
