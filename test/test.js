var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var hulkster = require('../hulkster');
var hogan = require('hogan.js');
var Hogan = hogan;
var templates;

function validTemplates(files, compiledObjects) {
  var template, i, compiledTemplate, file;

  for (i = 0; i < compiledObjects.length; i++) {
    compiledTemplate = compiledObjects[i];
    file = files[i];

    expect(compiledTemplate).to.have.property('file');
    expect(compiledTemplate.file).to.equal(file);
    expect(compiledTemplate).to.have.property('template');
    eval('template=new hogan.Template(' + compiledTemplate.template + ')');
    expect(template.render()).to.be.a('string');
  }
}

function validHelloWorld(pack) {
  eval(pack);
  expect(templates).to.have.property('x-hello-world');
  expect(templates['x-hello-world'].render({world: 'World'})).to.equal('Hello World!');
}

describe('Hulkster', function () {

  describe('#compile() (single file)', function () {
    it('should return an object with a compiled template', function () {
      var file = path.join(__dirname, 'templates/x-hello-world.mustache');
      validTemplates([file], hulkster.compile(file));
    });
  });

  describe('#compile() (several files)', function () {
    it('should return an object with several compiled templates', function () {
      var files = [
        path.join(__dirname, 'templates/x-hello-world.mustache'),
        path.join(__dirname, 'templates/x-smart-section.mustache')
      ];
      validTemplates(files, hulkster.compile(files));
    });
  });

  describe('#compile() (unique values)', function () {
    it('should return an object with several compiled templates', function () {
      var files = [
        path.join(__dirname, 'templates/x-smart-section.mustache'),
        path.join(__dirname, 'templates/x-smart-section.mustache')
      ];
      var compiledObjects = hulkster.compile(files);
      expect(compiledObjects).to.length(1);
    });
  });

  describe('#compile() (wildcard)', function () {
    it('should return an object with several compiled templates', function () {
      var files = [path.join(__dirname, 'templates/x-*.mustache')];
      var compiledObjects = hulkster.compile(files);

      validTemplates([
        path.join(__dirname, 'templates/x-hello-world.mustache'),
        path.join(__dirname, 'templates/x-smart-section.mustache')
      ], compiledObjects);
    });
  });

  describe('#compile(.., {format: "json"})', function () {
    it('should return an object with several compiled templates', function () {
      var file = path.join(__dirname, 'templates/x-hello-world.mustache');
      var compiledObjects = JSON.parse(hulkster.compile(file, {format: 'json'}));

      validTemplates([file], compiledObjects);
    });
  });

  describe('#compile(.., {format: "js"})', function () {
    it('should return a package of compiled templates', function () {
      var files = [path.join(__dirname, 'templates/x-*.mustache')];
      var pack = hulkster.compile(files, {format: 'js'});

      validHelloWorld(pack);
    });
  });

  describe('#compile(.., {format: "js", exportVar: "myCustomExport"})', function () {
    it('should return a package of compiled templates in myCustomExport variable', function () {
      var files = [path.join(__dirname, 'templates/x-hello-world.mustache')];
      var pack = hulkster.compile(files, {format: 'js', exportVar: 'myCustomExport'});

      eval(pack);
      expect(myCustomExport).to.have.property('x-hello-world');
      expect(myCustomExport['x-hello-world'].render({world: 'World'})).to.equal('Hello World!');
    });
  });

  describe('#compile(.., {format: "js", hoganVar: "hogan"})', function () {
    it('should return a package of compiled templates with "hogan" as hogan variable', function () {
      var files = [path.join(__dirname, 'templates/x-hello-world.mustache')];
      var pack = hulkster.compile(files, {format: 'js', hoganVar: 'hogan'});

      validHelloWorld(pack);
    });
  });

  describe('#compile(.., {format: "js", amd: true})', function () {
    it('should return a package of compiled templates in amd format', function () {
      var files = [path.join(__dirname, '/templates/x-hello-world.mustache')];
      var pack = hulkster.compile(files, {format: 'js', amd: true});

      expect(pack).to.match(/^define/);
    });
  });

  describe('#compile(.., {format: "js", amd: true, amdName: "module"})', function () {
    it('should return a package of compiled templates in a named amd module', function () {
      var files = [path.join(__dirname, '/templates/x-hello-world.mustache')];
      var pack = hulkster.compile(files, {format: 'js', amd: true, amdName: 'module'});

      expect(pack).to.match(/^define\('module',/);
    });
  });

  describe('#compile(.., {format: "js", minify: true})', function () {
    it('should return a package of compiled templates minified', function () {
      var files = [path.join(__dirname, 'templates/x-hello-world.mustache')];
      var pack = hulkster.compile(files, {format: 'js', minify: true});

      validHelloWorld(pack);
    });
  });

  describe('#compile(.., {format:  "js", output: "test.js"})', function () {
    it('should write package in a file', function () {
      var files = [path.join(__dirname, 'templates/x-hello-world.mustache')];
      var output = path.join(__dirname, 'output.testjs');

      hulkster.compile(files, {format: 'js', output: output});

      validHelloWorld(fs.readFileSync(output, 'utf-8'));
    });
  });

  describe('#compile(.., {format: "js", minifyHtml: true})', function () {
    it('should return an object with minified html template', function () {
      var file = path.join(__dirname, 'templates/html.mustache');
      var pack = hulkster.compile(file, {format: 'js', minifyHtml: true});
      eval(pack);
      expect(templates.html.render()).to.equal('<p>some ugly html</p><p>the end</p>');
    });
  });

  describe('#compile() (conditional style)', function () {
    it('should return a compiled template', function () {
      var file = path.join(__dirname, '/templates/conditional-style.mustache');
      var pack = hulkster.compile(file, {format: 'js', minifyHtml: true});

      eval(pack);

      expect(templates['conditional-style'].render({foo: 'bar'})).to.match(/<div\s+style="text-indent:30px"\s+><\/div>/);
    });
  });

  describe('#compile() (conditional class)', function () {
    it('should return a compiled template', function () {
      var file = path.join(__dirname, 'templates/conditional-class.mustache');
      var pack = hulkster.compile(file, {format: 'js', minifyHtml: true});

      eval(pack);

      expect(templates['conditional-class'].render({foo: 'bar'})).to.match(/<div\s+class="custom-class\s+test\s+"\s+><\/div>/);
    });
  });
});
