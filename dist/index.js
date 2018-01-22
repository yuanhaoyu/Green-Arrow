// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      function localRequire(x) {
        return newRequire(localRequire.resolve(x));
      }

      localRequire.resolve = function (x) {
        return modules[name][1][x] || x;
      };

      var module = cache[name] = new newRequire.Module;
      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  getUA() {
    return navigator.userAgent;
  },
  getNow() {
    return Date.parse(new Date());
  },
  getUrl() {
    return window.location.href;
  },
  getSC() {
    return document.documentElement.clientHeight + '*' + document.documentElement.clientWidth;
  }
};
},{}],2:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Star_Arrow = exports.Action_Arrow = undefined;

var _tool = require("../common/tool");

var _tool2 = _interopRequireDefault(_tool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Arrow {
  constructor(config) {
    this.base = {
      "src": config.src,
      "pid": config.pid,
      "channel": config.channel,
      "sc": '',
      "ua": '',
      "startTime": '',
      "endTime": ''
    };
    this.url = config.url;
    this.type = config.type && config.type.toUpperCase() === 'POST' ? config.type : 'GET';
    this.version = '0.0.0';
    this._init();
  }
  _init() {
    // 初始化配置
    this.base.sc = _tool2.default.getSC();
    this.base.src = _tool2.default.getUrl();
    this.ua = _tool2.default.getUA();
  }
  sendMsg(msg = {}) {
    if (this.type === 'GET') {
      let img = new Image();
      let query = Object.assign({}, { "base": this.base, "val": msg, "now": _tool2.default.getNow() });
      img.src = this.url + '?data=' + encodeURIComponent(JSON.stringify(query));
    } else {
      // todo: use post ajax
    }
  }
}

class Action_Arrow extends Arrow {
  auto() {
    // todo: add watcher
  }
  ok(msg) {
    this.sendMsg(msg);
  }
}

class Star_Arrow extends Arrow {
  constructor(config) {
    super(config);
    this._start();
    this._end();
  }
  _start() {
    this.base.startTime = _tool2.default.getNow();
    this.sendMsg({ "action": "in" });
  }
  _end() {
    let that = this;
    (function (win, t) {
      win.onbeforeunload = function (e) {
        t.base.startTime = _tool2.default.getNow();
        t.sendMsg({ "action": "out" });
      };
    })(window, that);
  }
}

exports.Action_Arrow = Action_Arrow;
exports.Star_Arrow = Star_Arrow;
},{"../common/tool":3}],1:[function(require,module,exports) {
"use strict";

var _arrow = require("./src/arrow");

var arrow = _interopRequireWildcard(_arrow);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const aw = {
  init(config) {
    if (config.type === 'aciton-arrow') {
      return new arrow.Action_Arrow(config.config);
    } else if (config.type === 'star-arrow') {
      return new arrow.Star_Arrow(config.config);
    }
  }
};

window.AW = aw;

// if (!window.AW) {

// } else {
//     console.error('window.AW is has!')
// }
},{"./src/arrow":2}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent) {
  var ws = new WebSocket('ws://localhost:63642/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      window.location.reload();
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error(`[parcel] 🚨 ${data.error.message}\n${data.error.stack}`);
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,1])