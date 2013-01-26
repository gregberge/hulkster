/*jshint evil:true expr:true undef:false unused:false */
var should = require('should'),
hulkster = require('../hulkster'),
hogan = require('hogan.js'),
Hogan = hogan,
fs = require('fs'),
templates;

function validTemplates(files, compiledObjects) {
  var template, i, compiledTemplate, file;

  for (i = 0; i < compiledObjects.length; i++) {
    compiledTemplate = compiledObjects[i];
    file = files[i];

    compiledTemplate.should.have.property('file');
    compiledTemplate.file.should.equal(file);

    compiledTemplate.should.have.property('template');
    eval('template=new hogan.Template(' + compiledTemplate.template + ')');
    template.render().should.be.a('string');
  }
}

function validHelloWorld(pack) {
  eval(pack);
  templates.should.have.property('x-hello-world');
  templates['x-hello-world'].render({world: 'World'}).should.equal('Hello World!');
}

describe('Hulkster', function () {

  describe('#compile() (single file)', function () {
    it('should return an object with a compiled template', function () {
      var file = __dirname + '/templates/x-hello-world.mustache',
      compiledObjects = hulkster.compile(file);

      validTemplates([file], compiledObjects);
    });
  });

  describe('#compile() (several files)', function () {
    it('should return an object with several compiled templates', function () {
      var files = [__dirname + '/templates/x-hello-world.mustache', __dirname + '/templates/x-smart-section.mustache'],
      compiledObjects = hulkster.compile(files);

      validTemplates(files, compiledObjects);
    });
  });

  describe('#compile() (unique values)', function () {
    it('should return an object with several compiled templates', function () {
      var files = [__dirname + '/templates/x-smart-section.mustache', __dirname + '/templates/x-smart-section.mustache'],
      compiledObjects = hulkster.compile(files);

      compiledObjects.length.should.equal(1);
    });
  });

  describe('#compile() (wildcard)', function () {
    it('should return an object with several compiled templates', function () {
      var files = [__dirname + '/templates/x-*.mustache'],
      compiledObjects = hulkster.compile(files);

      validTemplates([__dirname + '/templates/x-hello-world.mustache', __dirname + '/templates/x-smart-section.mustache'], compiledObjects);
    });
  });

  describe('#compile(.., {format: "json"})', function () {
    it('should return an object with several compiled templates', function () {
      var file = __dirname + '/templates/x-hello-world.mustache',
      compiledObjects = JSON.parse(hulkster.compile(file, {format: 'json'}));

      validTemplates([file], compiledObjects);
    });
  });

  describe('#compile(.., {format: "js"})', function () {
    it('should return a package of compiled templates', function () {
      var files = [__dirname + '/templates/x-*.mustache'],
      pack = hulkster.compile(files, {format: 'js'});

      validHelloWorld(pack);
    });
  });

  describe('#compile(.., {format: "js", exportVar: "myCustomExport"})', function () {
    it('should return a package of compiled templates in myCustomExport variable', function () {
      var files = [__dirname + '/templates/x-hello-world.mustache'],
      pack = hulkster.compile(files, {format: 'js', exportVar: 'myCustomExport'});

      eval(pack);
      myCustomExport.should.have.property('x-hello-world');
      myCustomExport['x-hello-world'].render({world: 'World'}).should.equal('Hello World!');
    });
  });

  describe('#compile(.., {format: "js", hoganVar: "hogan"})', function () {
    it('should return a package of compiled templates with "hogan" as hogan variable', function () {
      var files = [__dirname + '/templates/x-hello-world.mustache'],
      pack = hulkster.compile(files, {format: 'js', hoganVar: 'hogan'});

      validHelloWorld(pack);
    });
  });

  describe('#compile(.., {format: "js", amd: true})', function () {
    it('should return a package of compiled templates in amd format', function () {
      var files = [__dirname + '/templates/x-hello-world.mustache'],
      pack = hulkster.compile(files, {format: 'js', amd: true});

      pack.should.match(/^define/);
    });
  });

  describe('#compile(.., {format: "js", minify: true})', function () {
    it('should return a package of compiled templates minified', function () {
      var files = [__dirname + '/templates/x-hello-world.mustache'],
      pack = hulkster.compile(files, {format: 'js', minify: true});

      validHelloWorld(pack);
    });
  });

  describe('#compile(.., {format:  "js", output: "test.js"})', function () {
    it('should write package in a file', function () {
      var files = [__dirname + '/templates/x-hello-world.mustache'],
      output = 'test.js',
      pack;

      hulkster.compile(files, {format: 'js', output: output});

      pack = fs.readFileSync(output, 'utf-8');

      validHelloWorld(pack);
    });
  });

  describe('#compile(.., {format: "js", minifyHtml: true})', function () {
    it('should return an object with minified html template', function () {
      var file = __dirname + '/templates/html.mustache',
      pack = hulkster.compile(file, {format: 'js', minifyHtml: true});
      eval(pack);
      templates.html.render().should.equal('<p>some ugly html</p><p>the end</p>');
    });
  });

  describe('#compile() (conditional style)', function () {
    it('should return a compiled template', function () {
      var file = __dirname + '/templates/conditional-style.mustache',
      pack = hulkster.compile(file, {format: 'js', minifyHtml: true});

      eval(pack);

      templates['conditional-style'].render({foo: 'bar'}).should.equal('<div  style="text-indent:30px"  ></div>');
    });
  });

  after(function () {
    fs.unlinkSync('test.js');
  });

});