"use strict";

var _child_process = require("child_process");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd) {
  return new Promise(function(resolve, reject) {
    (0, _child_process.exec)(cmd, function(err, stdout, stderr) {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout: stdout, stderr: stderr });
      }
    });
  });
}

function parseFile(string) {
  var regex = /\d{0,}px/g;
  var found = string.match(regex);

  if (found) {
    var value = found.map(function(value) {
      var v = value.split("px")[0];
      var newValue = parseInt(v) * scale;
      return newValue + "vh";
    });

    found.map(function(fss, index) {
      string = string.replace(new RegExp(fss, "g"), value[index]);
    });
  }

  return string;
}

function parseFileReverse(string) {
  var regex = /\d{0,}vh/g;
  var found = string.match(regex);

  if (found) {
    var value = found.map(function(value) {
      var v = value.split("px")[0];
      var newValue = parseInt(v) / scale;
      return newValue + "px";
    });

    found.map(function(fss, index) {
      string = string.replace(new RegExp(fss, "g"), value[index]);
    });
  }

  return string;
}

async function main() {
  var command = "find ./ -name *.scss ";

  var _ref = await sh(command),
    stdout = _ref.stdout;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (
      var _iterator = stdout.split("\n")[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var path = _step.value;

      if (_fs2.default.existsSync(path)) {
        var file = _fs2.default.readFileSync(path, "utf-8");
        var string = void 0;
        if (reverse) {
          console.log("Reversing the file " + path);
          string = parseFileReverse(file);
        } else {
          console.log("Scaling the file " + path + ", scale " + scale);
          string = parseFile(file);
        }
        _fs2.default.writeFileSync(path, string);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

var scale = process.argv[process.argv.indexOf("-s") + 1] || 0.3;
var reverse = process.argv.includes("-r");

console.log(scale);
main();
