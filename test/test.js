var should = require('should'),
hulkster = require('../hulkster'),
hogan = require('hogan.js'),
Hogan = hogan,
fs = require('fs');

function validTemplates(files, compiledObjects) {
  var template, i, compiledTemplate, file;

  for(i = 0; i < compiledObjects.length; i++) {
    compiledTemplate = compiledObjects[i];
    file = files[i];

    compiledTemplate.should.have.property('file');
    compiledTemplate.file.should.equal(file);

    compiledTemplate.should.have.property('template');
    eval("template=new hogan.Template(" + compiledTemplate.template + ")");
    template.render().should.be.a("string");
  }
};

function validHelloWorld(package) {
  eval(package);
  templates.should.have.property('hello-world');
  templates['hello-world'].render({world: 'World'}).should.equal("Hello World!");
};

describe('Hulkster', function() {

  describe('#compile() (single file)', function() {
    it('should return an object with a compiled template', function() {
      var file = __dirname + "/templates/hello-world.mustache",
      compiledObjects = hulkster.compile(file);

      validTemplates([file], compiledObjects);
    });
  });

  describe('#compile() (several files)', function() {
    it('should return an object with several compiled templates', function() {
      var files = [__dirname + "/templates/hello-world.mustache", __dirname + "/templates/smart-section.mustache"],
      compiledObjects = hulkster.compile(files);

      validTemplates(files, compiledObjects);
    });
  });

  describe('#compile() (unique values)', function() {
    it('should return an object with several compiled templates', function() {
      var files = [__dirname + "/templates/smart-section.mustache", __dirname + "/templates/smart-section.mustache"],
      compiledObjects = hulkster.compile(files);

      compiledObjects.length.should.equal(1);
    });
  });

  describe('#compile() (wildcard)', function() {
    it('should return an object with several compiled templates', function() {
      var files = [__dirname + "/templates/*.mustache"],
      compiledObjects = hulkster.compile(files);

      validTemplates([__dirname + "/templates/hello-world.mustache", __dirname + "/templates/smart-section.mustache"], compiledObjects);
    });
  });

  describe('#compile(.., {format: "json"})', function() {
    it('should return an object with several compiled templates', function() {
      var file = __dirname + "/templates/hello-world.mustache",
      compiledObjects = JSON.parse(hulkster.compile(file, {format: "json"}));

      validTemplates([file], compiledObjects);
    });
  });

  describe('#compile(.., {format: "js"})', function() {
    it('should return a package of compiled templates', function() {
      var files = [__dirname + "/templates/*.mustache"],
      package = hulkster.compile(files, {format: 'js'});

      validHelloWorld(package);
    });
  });

  describe('#compile(.., {format: "js", exportVar: "myCustomExport"})', function() {
    it('should return a package of compiled templates in myCustomExport variable', function() {
      var files = [__dirname + "/templates/hello-world.mustache"],
      package = hulkster.compile(files, {format: 'js', exportVar: 'myCustomExport'});

      eval(package);
      myCustomExport.should.have.property('hello-world');
      myCustomExport['hello-world'].render({world: 'World'}).should.equal("Hello World!");
    });
  });

  describe('#compile(.., {format: "js", hoganVar: "hogan"})', function() {
    it('should return a package of compiled templates with "hogan" as hogan variable', function() {
      var files = [__dirname + "/templates/hello-world.mustache"],
      package = hulkster.compile(files, {format: 'js', hoganVar: 'hogan'});

      validHelloWorld(package);
    });
  });

  describe('#compile(.., {format: "js", amd: true})', function() {
    it('should return a package of compiled templates in amd format', function() {
      var files = [__dirname + "/templates/hello-world.mustache"],
      package = hulkster.compile(files, {format: 'js', amd: true});

      package.should.match(/^define/);
    });
  });

  describe('#compile(.., {format: "js", minify: true})', function() {
    it('should return a package of compiled templates minified', function() {
      var files = [__dirname + "/templates/hello-world.mustache"],
      package = hulkster.compile(files, {format: 'js', minify: true});

      validHelloWorld(package);
    });
  });

  describe('#compile(.., {format:  "js", output: "test.js"})', function() {
    it('should return a package of compiled templates minified', function() {
      var files = [__dirname + "/templates/hello-world.mustache"],
      output = 'test.js',
      package;

      hulkster.compile(files, {format: 'js', output: output});

      package = fs.readFileSync(output, 'utf-8');

      validHelloWorld(package);
    });
  });

  after(function() {
    fs.unlinkSync('test.js');
  });

});