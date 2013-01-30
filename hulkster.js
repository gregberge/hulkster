var hogan = require('hogan.js'),
glob = require('glob'),
fs = require('fs'),
_ = require('lodash'),
path = require('path'),
uglify = require('uglify-js'),
htmlMinifier = require('html-minifier');

// Remove utf-8 byte order mark, http://en.wikipedia.org/wiki/Byte_order_mark
function removeByteOrderMark(text) {
  if (text.charCodeAt(0) === 0xfeff) {
    return text.substring(1);
  }
  return text;
}

var compileFile = function (file, minifyHtml) {
  var rf = fs.readFileSync(file, 'utf-8');
  removeByteOrderMark(rf.trim());

  if (minifyHtml) {

    rf = rf.replace(/\{\{\s*#\s*([\w\.]+)\s*\}\}/, ' data-hulkster:open:$1 ');
    rf = rf.replace(/\{\{\s*\/\s*([\w\.]+)\s*\}\}/, ' data-hulkster:close:$1 ');
    rf = rf.replace(/\{\{\s*([\w\.]+)\s*\}\}/, ' data-hulkster:$1 ');



    rf = htmlMinifier.minify(rf, {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true,
      cleanAttributes: true,
      removeScriptTypeAttributes: true
    });

    rf = rf.replace(/data-hulkster:open:([\w\.]+)(="")?/, '{{#$1}}');
    rf = rf.replace(/data-hulkster:close:([\w\.]+)(="")?/, '{{/$1}}');
    rf = rf.replace(/data-hulkster:([\w\.]+)(="")?/, '{{$1}}');
  }

  return hogan.compile(rf, {asString: true});
};

var expandFile = function (file) {
  return glob.sync(file);
};

var getVariableFriendlyName = function (file) {
  return path.basename(file).replace(/\..*$/, '');
};

var jsPack = function (compiledObjects, options) {

  options = options || {};

  var name,
  output,
  ast,
  packLines = [],
  exportVar = options.exportVar || 'templates',
  hoganVar = options.hoganVar || 'Hogan',
  hoganPath = options.hoganPath || 'hogan',
  amd = options.amd || false,
  minify = options.minify || false;

  if (amd) {
    packLines.push('define(["' + hoganPath + '"], function(' + hoganVar + ') {');
  }

  packLines.push('var ' + exportVar + '={};');

  compiledObjects.forEach(function (compiledObject) {
    name = getVariableFriendlyName(compiledObject.file);
    packLines.push(exportVar + '["' + name + '"] = new ' + hoganVar + '.Template(' + compiledObject.template + ');');
  });

  if (amd) {
    packLines.push('return ' + exportVar + ';\n});');
  }

  output = packLines.join('\n');

  if (minify) {
    ast = uglify.parser.parse(output);
    ast = uglify.uglify.ast_mangle(ast);
    ast = uglify.uglify.ast_squeeze(ast);
    return uglify.uglify.gen_code(ast);
  }
  else {
    return output;
  }
};

var compile = function (files, options) {
  options = options || {};
  files = typeof files === 'string' ? [files] : files;

  var matchedFiles = [],
  compiledObjects = [],
  compiledObject,
  output;

  files.forEach(function (file) {
    matchedFiles = matchedFiles.concat(expandFile(file));
  });

  matchedFiles = _.uniq(matchedFiles);

  matchedFiles.forEach(function (file) {
    compiledObject = {};
    compiledObject.file = file;
    compiledObject.template = compileFile(file, options.minifyHtml);
    compiledObjects.push(compiledObject);
  });

  if (typeof options.format === 'string') {
    if (options.format === 'js') {
      output = jsPack(compiledObjects, options);
    }
    else if (options.format === 'json') {
      output = JSON.stringify(compiledObjects);
    }

    if (typeof options.output === 'string') {
      fs.writeFileSync(options.output, output, 'utf-8');
      return;
    }

    return output;
  }

  return compiledObjects;
};


exports.compile = compile;