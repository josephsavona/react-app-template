var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var argv = require('minimist')(process.argv.slice(2), {
  string: ['name'],
  default: {
    name: null
  }
});

module.exports = function() {
  if (!argv.name) {
    console.error('missing "name": gulp template --name="component-name"');
    process.exit(1);
  }
  var componentName = argv.name
    .replace(/[^a-zA-Z]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/(^|_)(\w)/g, function(match, prefix, c) {
      return c.toUpperCase();
    })
  var className = argv.name
    .replace(/[^a-zA-Z]+/g, '-')
    .replace(/[-]+/g, '-')
    .toLowerCase();

  var folderPath = path.join(__dirname, '..', 'lib', 'components', className);
  if (fs.existsSync(folderPath)) {
    console.error('folder exists: ' + folderPath);
    process.exit(1);
  }
  fs.mkdirSync(folderPath);

  var js = fs.readFileSync(path.join(__dirname, '..', 'lib', 'components', '_template', 'template.js.ejs'), 'utf8');
  fs.writeFileSync(path.join(__dirname, '..', 'lib', 'components', className, className + '.js'), ejs.render(js, {
    componentName: componentName,
    componentClassName: className
  }));

  var less = fs.readFileSync(path.join(__dirname, '..', 'lib', 'components', '_template', 'template.less.ejs'), 'utf8');
  fs.writeFileSync(path.join(__dirname, '..', 'lib', 'components', className, className + '.less'), ejs.render(less, {
    componentName: componentName,
    componentClassName: className
  }));

  var spec = fs.readFileSync(path.join(__dirname, '..', 'lib', 'components', '_template', 'template-spec.js.ejs'), 'utf8');
  fs.writeFileSync(path.join(__dirname, '..', 'lib', 'components', className, className + '-spec.js'), ejs.render(spec, {
    componentName: componentName,
    componentClassName: className
  }));

  console.log('Created %s component with className %s', componentName, className);
  console.log('Next Steps:');
  console.log('- import %s.less in index.less', className);
  console.log('- export %s from lib/components/components.js', componentName);
}