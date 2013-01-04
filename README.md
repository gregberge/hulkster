#Hulkster

Hulkster is a tool (command line + node) to compile [hogan.js](http://twitter.github.com/hogan.js/) templates. Hogan.js has a similar tool named "hulk", but it is too simple to meet the majority of use cases. So hulkster is a kind of super "hulk".

[![Build Status](https://travis-ci.org/neoziro/hulkster.png?branch=master)](https://travis-ci.org/neoziro/hulkster)

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

Copyright (c) 2012 Bergé Greg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
