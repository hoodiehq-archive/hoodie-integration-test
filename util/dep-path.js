var exec = require('child_process').exec;
var path = require('path');

var NM = 'node_modules';

var exports = module.exports = function(cwd, module, callback) {
  exports.getNpmList(cwd, function(list) {
    exports.handleDependencies(module, '', list.dependencies, callback);
  });
};

exports.getNpmList = function(cwd, callback) {
  exec('npm ls --json', {
    cwd: path.resolve(cwd) || process.cwd()
  },function(err, stdout, stderr) {
    if (err) {
      console.log(stderr);
      throw err;
    }
    callback(JSON.parse(stdout));
  });
};

exports.handleDependencies = function(module, depPath, deps, callback) {
  Object.keys(deps).forEach(function(name) {
    var dep = deps[name];
    if (name === module) {
      return callback(depPath);
    }
    if (dep.dependencies) {
      return exports.handleDependencies(
        module,
        path.join(depPath, NM, name),
        dep.dependencies,
        callback
      );
    }
  });
};

