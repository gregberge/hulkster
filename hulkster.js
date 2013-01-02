var hogan = require('hogan.js'),
globsync = require('glob-whatev'),
fs = require('fs'),
_ = require('lodash'),
path = require('path'),
uglify = require('uglify-js');

// Remove utf-8 byte order mark, http://en.wikipedia.org/wiki/Byte_order_mark
function removeByteOrderMark(text) {
  if (text.charCodeAt(0) === 0xfeff) {
    return text.substring(1);
  }
  return text;
}

var compileFile = function(file) {
  var rf = fs.readFileSync(file, 'utf-8');
  removeByteOrderMark(rf.trim());
  return hogan.compile(rf, {asString: true});
};

var expandFile = function(file) {
  return globsync.glob(file);
};

var getVariableFriendlyName = function(file) {
  return path.basename(file).replace(/\..*$/, '');
};

var jsPack = function(compiledObjects, options) {

  options = options || {};

  var name,
  output,
  ast,
  packLines = [],
  exportVar = options.exportVar || 'templates',
  hoganVar = options.hoganVar || 'Hogan',
  hoganPath = options.hoganPath || 'hogan',
  amd = options.amd || false,
  minify = options.minify || false;

  if(amd) {
    packLines.push('define(["' + hoganPath + '"], function(' + hoganVar + ') {');
  }

  packLines.push('var ' + exportVar + '={};');

  compiledObjects.forEach(function(compiledObject) {
    name = getVariableFriendlyName(compiledObject.file);
    packLines.push(exportVar + '["' + name + '"] = new ' + hoganVar + '.Template(' + compiledObject.template + ');');
  });

  if(amd) {
    packLines.push('return ' + exportVar + ';\n});');
  }

  output = packLines.join('\n');

  if(minify) {
    ast = uglify.parser.parse(output);
    ast = uglify.uglify.ast_mangle(ast);
    ast = uglify.uglify.ast_squeeze(ast);
    return uglify.uglify.gen_code(ast);
  }
  else {
    return output;
  }
};

var compile = function(files, options) {
  if(typeof files === 'string') {
    files = [files];
  }

  options = options || {};

  var matchedFiles = [],
  compiledObjects = [],
  compiledObject;

  files.forEach(function(file) {
    matchedFiles = matchedFiles.concat(expandFile(file));
  });

  matchedFiles = _.uniq(matchedFiles);

  matchedFiles.forEach(function(file){
    compiledObject = {};
    compiledObject.file = file;
    compiledObject.template = compileFile(file);
    compiledObjects.push(compiledObject);
  });

  if(typeof options.output === "string") {
    if(options.output === "js") {
      return jsPack(compiledObjects, options);
    }
    else if (options.output === "json") {
      return JSON.stringify(compiledObjects);
    }
  }

  return compiledObjects;
};


exports.compile = compile;