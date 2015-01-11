var hogan = require('hogan.js');
var glob = require('glob');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var uglify = require('uglify-js');
var htmlMinifier = require('html-minifier');

// Expose module.
exports.compile = compile;

// Remove utf-8 byte order mark, http://en.wikipedia.org/wiki/Byte_order_mark
function removeByteOrderMark(text) {
  if (text.charCodeAt(0) === 0xfeff) {
    return text.substring(1);
  }
  return text;
}

function compileFile(file, minifyHtml) {
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
}

function expandFile(file) {
  return glob.sync(file);
}

function getVariableFriendlyName(file) {
  return path.basename(file).replace(/\..*$/, '');
}

function jsPack(compiledObjects, options) {

  options = options || {};

  var name;
  var output;
  var ast;
  var packLines = [];
  var exportVar = options.exportVar || 'templates';
  var hoganVar = options.hoganVar || 'Hogan';
  var hoganPath = options.hoganPath || 'hogan';
  var amd = options.amd || false;
  var amdName = options.amdName;
  var minify = options.minify || false;

  if (amd) {
    var define = 'define(' + (amdName ? '\'' + amdName + '\', ' : '');
    packLines.push(define + '[\'' + hoganPath + '\'], function(' + hoganVar + ') {');
  }

  packLines.push('var ' + exportVar + '={};');

  compiledObjects.forEach(function (compiledObject) {
    name = getVariableFriendlyName(compiledObject.file);
    packLines.push(exportVar + '["' + name + '"] = new ' + hoganVar + '.Template(' + compiledObject.template + ');');
  });

  if (amd)
    packLines.push('return ' + exportVar + ';\n});');

  output = packLines.join('\n');

  if (!minify) return output;

  ast = uglify.parse(output);
  ast.figure_out_scope();
  var compressor = uglify.Compressor();
  ast = ast.transform(compressor);
  ast.figure_out_scope(options.mangle);
  ast.compute_char_frequency(options.mangle);
  ast.mangle_names(options.mangle);
  return ast.print_to_string();
}

function compile(files, options) {
  options = options || {};
  files = typeof files === 'string' ? [files] : files;

  var matchedFiles = [];
  var compiledObjects = [];
  var compiledObject;
  var output;

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
}
