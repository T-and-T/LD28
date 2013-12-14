!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.Class=e():"undefined"!=typeof global?global.Class=e():"undefined"!=typeof self&&(self.Class=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Mixin    = require('hydro-mixin');
var Emitter  = require('emitter-component');

/**
 * Undefined Descriptor
 */

var undefinedDescriptor = {
  configurable: true,
  writable: true,
  enumerable: false,
  value: undefined
};


/**
 * Create the constructor and setup the prototype
 * object. This will go ahead and apply all the initial mixins
 * and properties to the prototype and mixin the PrototypeMixin.
 *
 *
 * @public
 * @name makeCtor
 * @return {Class}
 */

function makeCtor() {

  // Default variables.
  var wasApplied = false, initMixins, initProperties;

  var Class = function() {

    /**
     * Initialize the prototype property of this class. Only if
     * it wasn't applied already.
     */

    if (!wasApplied) {
      Class.proto();
    }

    /**
     * Define an empty `_super` property on the prototype.
     */

    Object.defineProperty(this, '_super', undefinedDescriptor);

    /**
     * Apply any initial mixins that we may have.
     */

    if (initMixins) {
      var mixins = initMixins;
      initMixins = null;
      console.log(this);
      this.reopen.apply(this, mixins);
    }

    /**
     * Apply any initial properties that we may have.
     */

    if (initProperties) {
      var props = Array.prototype.slice.call(initProperties);
      initProperties = null;
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (prop instanceof Mixin) {
          //this.reopen.apply(this.PrototypeMixin, prop);
        } else if ('object' === typeof prop && !(prop instanceof Array)) {
          for (var key in prop) {
            this[key] = prop[key];
          }
        }
      }
    }

    // We're done with the main constructor, let's call a
    // synthesised `init` function. The default `init` method
    // is empty.

    this.init.apply(this, arguments);
  }

  /**
   * Apply the Mixin's toString function by default
   *
   * @name toString
   * @public
   * @proto
   * @return {String}
   */

  Class.toString = Mixin.prototype.toString;

  /**
   * Check if the class was already applied when we reopen it.
   * If the PrototypeMixin was already applied to the prototype
   * then re-create it.
   *
   * @name willReopen
   * @public
   * @static
   * @return {Undefined}
   */

  Class.willReopen = function() {
    if (wasApplied) {
      Class.PrototypeMixin = Mixin.create(Class.PrototypeMixin);
    }

    wasApplied = false;
  };

  /**
   * Set the initial Mixins for the class.
   *
   * @name _initMixins
   * @public
   * @static
   * @return {Undefined}
   */

  Class._initMixins = function(args) {
    initMixins = args;
  };

  /**
   * Set the initial properties for the class.
   *
   * @name _initProperties
   * @public
   * @static
   * @return {Undefined}
   */

  Class._initProperties = function(args) {
    initProperties = args;
  };

  /**
   * Initialize the prototype for the class. This will setup
   * the superclass' prototype object as well, if a superclass is
   * present.
   *
   * It will also apply the PrototypeMixin to the class' prototype
   * object and then return the prototype.
   *
   * @name proto
   * @public
   * @proto
   * @return {Prototype} Class' Prototype
   */

  Class.proto = function() {
    var superclass = Class.superclass;
    if (superclass) {
      superclass.proto();
    }

    if (!wasApplied) {
      wasApplied = true;
      Class.PrototypeMixin.apply(Class.prototype);
    }

    return this.prototype;
  }

  // Finally return the new constructor.
  return Class;
}

/**
 * Create a new constructor that will form the basis for all
 * classes `CoreClass`.
 *
 * @return {Function} Class Constructor
 */

var CoreClass = makeCtor();

/**
 * Module exports.
 */

exports = module.exports = CoreClass;

/**
 * Expose `Mixin`.
 */

exports.Mixin = Mixin;

/**
 * Emitter
 */

Emitter(CoreClass);

/**
 * Prototype
 */

Emitter(CoreClass.prototype);

/**
 * toString
 */

CoreClass.toString = function() {
  return '<CoreClass>';
}

/**
 * Create a default `__super__`. This is used to establish
 * superclasses when extending another class.
 *
 * @static
 * @type {null}
 */

CoreClass.__super__ = null;

/**
 * PrototypeMixin (Prototype)
 *
 * Create a new Mixin that will act as the prototype object.
 * This will currently allow us to easily create new extending classes
 * by working with these set Mixins.
 *
 * @property {Mixin} PrototypeMixin
 * @static
 * @return {Mixin}
 */

CoreClass.PrototypeMixin = Mixin.create({

  /**
   * This is the default initialization method. This acts like a proxy
   * constructor, where, after the constructor finalizes it's duties,
   * this method will be called.
   *
   * A subclass will most likely override this method, which will be
   * called, instead.
   *
   * @method init
   * @proto
   */

  init: function() {
    this.emit('class:init', this);
  },

  /**
   * `reopen` will reopen the prototype Mixin for new additions. This allows
   * one to create whole classes in steps, rather than at once. This will
   * reapply the PrototypeMixin.
   *
   * @method reopen
   * @proto
   * @return {Class}
   */

  reopen: function() {
    Mixin.reopen.apply(this.PrototypeMixin, arguments);
    return this;
  }

});

/**
 * ClassMixin (Static).
 *
 * Create a new static Mixin that will act as the static properties for the
 * classes. This allows us to easily create new classes, and simply apply
 * this Mixin. Resulting is higher code reuse.
 *
 * @property {Mixin} ClassMixin
 * @return {Mixin}
 */

CoreClass.ClassMixin = Mixin.create({

  extend: function() {
    //console.log(this.ClassMixin.mixins[0].mixins);
    var Class = makeCtor(), proto;
    Class.ClassMixin = Mixin.create(this.ClassMixin);
    Class.PrototypeMixin = Mixin.create(this.PrototypeMixin);

    Class.ClassMixin.ownerConstructor = Class;
    Class.PrototypeMixin.ownerConstructor = Class;

    Mixin.reopen.apply(Class.PrototypeMixin, arguments);

    Class.superclass = this;
    Class.__super__  = this.prototype;

    proto = Class.prototype = Object.create(this.prototype);
    proto.constructor = Class;
    Class.ClassMixin.apply(Class);
    return Class;
  },

  create: function() {
    var C = this;
    if (arguments.length>0) { this._initProperties(arguments); }
    return new C();
  },

  reopen: function() {
    this.willReopen();
    Mixin.reopen.apply(this.PrototypeMixin, arguments);
    return this;
  },

  reopenClass: function() {
    Mixin.reopen.apply(this.ClassMixin, arguments);
    this.ClassMixin.apply(this);
    //Mixin._apply(this, arguments);
    //console.log(this, arguments);
    return this;
  },

  detect: function(obj) {
    if ('function' !== typeof obj) { return false; }
    while(obj) {
      if (obj===this) { return true; }
      obj = obj.superclass;
    }
    return false;
  }

});

/**
 * Apply the ClassMixin:
 */

CoreClass.ClassMixin.apply(CoreClass);

},{"emitter-component":2,"hydro-mixin":4}],2:[function(require,module,exports){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{"indexof":3}],3:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],4:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Meta = require('./lib/meta');
var Wrap = require('super-wrap');

/**
 * Module exports
 */

exports = module.exports = Mixin;

/**
 * Expose `Meta`
 */

exports.Meta = Meta;

/**
 * Create
 */

exports.create = function() {
  var C = new Mixin();
  C.initMixin(Array.prototype.slice.call(arguments));
  return C;
};

/**
 * Apply
 */

exports._apply = function(obj, mixins) {
  if (('object' === typeof obj || 'function' === typeof obj) && !(obj instanceof Array)) {
    return Mixin.prototype.applyObject(this, obj);
  }

  throw new Error("Argument passed to Mixin.apply has to be a mixin instance or an object.");
};

/**
 * Mixin
 */

exports.mixin = function(obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  Mixin.prototype.applyObject(args, obj);
  return obj;
};

/**
 * Mixin Class.
 *
 * Each mixin will hold it's mixins, and it's properties.
 *
 */

function Mixin() {
  this.mixins = [];
  this.properties = {};
}

/**
 * Init Mixins
 */

Mixin.prototype.initMixin = function(args) {

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];

    if (arg instanceof Mixin) {
      this.mixins.push(arg);
    } else {
      var mixin = new Mixin();
      mixin.properties = arg;
      this.mixins.push(mixin);
    }
  }

};

/**
 * toString
 */

Mixin.toString = function() {
  return '<Mixin>';
}

/**
 * Reopen
 */

Mixin.prototype.reopen = function() {

  /**if (this.properties) {
    var mixin = new Mixin();
    mixin.properties = this.properties;
    delete this.properties;
    this.mixins = [mixin];
  } else if (!this.mixins) {
    this.mixins = [];
  }**/

  this.initMixin(Array.prototype.slice.call(arguments));

  return this;
};

/**
 * Apply
 */

Mixin.prototype.apply = function(obj) {
  if (('object' === typeof obj || 'function' === typeof obj) && !(obj instanceof Array)) {
    return Mixin.prototype.applyObject(this, obj);
  }

  throw new Error("Argument passed to Mixin.apply has to be a mixin instance or an object.");
};

/**
 * Expose `apply`
 */

exports.apply = Mixin.prototype.apply;

/**
 * Expose `reopen`
 */

exports.reopen = Mixin.prototype.reopen;

/**
 * findNextParent
 */

function findNextParent(obj, callback) {

  function nextParent(object) {
    if (object.parent) {
      var ret = callback(object);
      if (ret) {
        return nextParent(object.parent);
      }
    }
  }

  return nextParent(obj);
}

/**
 * findChild
 */

function findChild(obj) {
  if (obj.child) {
    return findChild(obj.child);
  }
  return obj;
}

/**
 * ApplyObject
 */

Mixin.prototype.applyObject = function(obj, target) {
  var fns = {};
  var values = target;

  function nextMixin(mix) {
    if (mix.properties) {
      applyProperties(mix.properties);
    }

    if (mix.mixins) {
      for (var i = 0; i < mix.mixins.length; i++) {
        nextMixin(mix.mixins[i]);
      }
    }
  }

  function applyProperties(props) {
    if (!props) {
      throw new Error("No properties found.");
    }

    for (var key in props) {
      var val = props[key];
      if ('function' === typeof val) {
        if (values[key]) {
          // The object already has the key. We'll need to setup a
          // prototype around it.
          var parent = values[key];
          values[key] = Wrap(val, parent);
        } else {
          // If the target (base class/object) doesn't have the key
          // then we'll just take it.
          values[key] = val;
        }
      } else {
        values[key] = val;
      }
    }
  }

  function applyMixins(mixin) {
    for (var j = 0; j < mixin.mixins.length; j++) {
      var props = mixin.mixins[j].properties;

      applyProperties(props);
    }
  }

  if (obj instanceof Mixin) {
    for (var i = 0; i < obj.mixins.length; i++) {
      var mixin = obj.mixins[i];
      nextMixin(mixin);
      //applyMixins(mixin);
      //applyProperties(mixin.properties);
    }
  } else if ('object' === typeof obj && !(obj instanceof Array)) {
    applyProperties(target);
  } else if (obj instanceof Array) {
    for (var i = 0; i < obj.length; i++) {
      applyProperties(obj[i]);
    }
  }
  return target;
};

/**
 * HandleFunctions
 *
 * This will setup the _super chain. The smallest indexes will be the latest
 * Mixins. Thus, the smaller indexes will be the children.
 */

Mixin.prototype.handleFunctions = function(fns, target) {

  for (var key in fns) {
    var parent = fns[key];
    var child = findChild(parent);

    function next(object, parent) {
      object.val = Wrap(object.val, parent && parent.val);

      if (object.child) {
        return next(object.child, object);
      }
    }

    next(parent);
    target[key] = child.val;
  }

};
},{"./lib/meta":5,"super-wrap":6}],5:[function(require,module,exports){
/**
 * Module exports
 */

exports = module.exports = Meta;

/**
 * Last ID
 */

exports._id = 0;

/**
 * Meta
 *
 * Usage:
 *   Meta(obj);
 *
 */

function Meta(obj) {
  if (!obj._meta) {
    Object.defineProperty(obj, '_meta', {
      enumerable: false,
      value: exports._id++,
      writable: true
    });
  } else {
    obj._meta = exports._id++;
  }

  return obj;
}
},{}],6:[function(require,module,exports){
/**
 * Module exports
 */

module.exports = function wrap(fn, superFn) {
  // An empty super
  function Empty() {}

  // This is what people call instead of the normal function.
  // superWrapper will take care of initializing the correct _super
  // method and then call the correct method.
  //
  function superWrapper() {

    // Backup the original _super:
    var sup = this._super, val;

    if (superFn == null) {
      superFn = Empty;
    }

    // Create a new super:
    this._super = superFn || Empty;

    // Call the method:
    val = fn.apply(this, arguments);

    // Restore the original _super.
    this._super = sup;

    return val;
  }


  superWrapper.wrappedFunction = fn;

  return superWrapper;
}
},{}]},{},[1])
(1)
});
;