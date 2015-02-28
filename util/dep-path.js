var exec = require('child_process').exec;
var path = require('path');

var NM = 'node_modules';

var exports = module.exports = function(cwd, module, callback) {
  exports.getNpmList(cwd, function(list) {
    if (!exports.handleDependencies(module, './', list.dependencies, callback)) {
      callback(null);
    }
  });
};

exports.getNpmList = function(cwd, callback) {
  exec('npm ls --json --depth=3', {
    cwd: path.resolve(cwd) || process.cwd()
  }, function(err, stdout) {
    try {
      callback(JSON.parse(stdout));
    } catch (_e) {
      if (err) {
        throw err;
      }
      throw _e;
    }
  });
};

exports.handleDependencies = function(module, depPath, deps, callback) {
  // This will only find the first occurance of the module
  // which is entirely cool for hoodie's usecase
  /*jshint forin: false */
  for (var name in deps) {
    var dep = deps[name];
    if (name === module) {
      callback(depPath);
      return true;
    }
    if (dep.dependencies) {
      if (exports.handleDependencies(
        module,
        path.join(depPath, NM, name),
        dep.dependencies,
        callback
      )) {
        return true;
      }
    }
  }
  return false;
};

