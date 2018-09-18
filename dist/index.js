"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var NOT = function (x) { return !x; };
var EQUAL = function (x, y) { return x == y; };
var NOT_EQUAL = function (x, y) { return NOT(EQUAL(x, y)); };
var BIGGER_THAN = function (x, y) { return x > y; };
var LOWER_THAN = function (x, y) { return x < y; };
var OR = function (x, y) { return x || y; };
var AND = function (x, y) { return x && y; };
var BIGGER_OR_EQUAL_THAN = function (x, y) { return OR(BIGGER_THAN(x, y), EQUAL(x, y)); };
var LOWER_OR_EQUAL_THAN = function (x, y) { return OR(LOWER_THAN(x, y), EQUAL(x, y)); };
var GET = function (x) { return x; };
var DEFAULT_CONFIG = {
    methods: {
        'eq': EQUAL,
        'neq': NOT_EQUAL,
        'not': NOT,
        'bt': BIGGER_THAN,
        'bte': BIGGER_OR_EQUAL_THAN,
        'lt': LOWER_THAN,
        'lte': LOWER_OR_EQUAL_THAN,
        'and': AND,
        'or': OR,
        'get': GET
    },
    variables: {},
    variablePrefix: '$',
    methodPrefix: '@'
};
var Hippo = (function () {
    function Hippo(config) {
        var _this = this;
        this._methods = {};
        this._variables = {};
        this._configure(config);
        this.registerMethod('set', function (value, name) {
            _this.registerVariable(name, value);
        });
    }
    Hippo.prototype._configure = function (config) {
        if (config === void 0) { config = {}; }
        this.config = {
            variablePrefix: config.variablePrefix || DEFAULT_CONFIG.variablePrefix,
            methodPrefix: config.methodPrefix || DEFAULT_CONFIG.methodPrefix,
            variables: __assign({}, DEFAULT_CONFIG.variables, (config.variables || {})),
            methods: __assign({}, DEFAULT_CONFIG.methods, (config.methods || {})),
            plugins: config.plugins || []
        };
        this._variableResolver = config.variableResolver || (function (x) { return x; });
        this._methods = {};
        for (var name in this.config.methods) {
            this.registerMethod(name, this.config.methods[name]);
        }
        this._variables = {};
        for (var name in this.config.variables) {
            this.registerVariable(name, this.config.variables[name]);
        }
        for (var _i = 0, _a = this.config.plugins; _i < _a.length; _i++) {
            var plugin = _a[_i];
            plugin(this.config);
        }
    };
    Hippo.prototype.registerMethod = function (name, fn) {
        this._methods[this.config.methodPrefix + name] = fn;
    };
    Hippo.prototype.executeMethod = function (name, args) {
        var _a;
        if (!this._methods[name]) {
            throw new Error('Method not defined: ' + name);
        }
        return (_a = this._methods)[name].apply(_a, args);
    };
    Hippo.prototype.isMethod = function (fragment) {
        return fragment.charAt(0) === this.config.methodPrefix;
    };
    Hippo.prototype.isVariable = function (fragment) {
        return fragment.charAt(0) === this.config.variablePrefix;
    };
    Hippo.prototype.registerVariable = function (name, value) {
        this._variables[this.config.variablePrefix + name] = value;
    };
    Hippo.prototype.resolveVariable = function (name) {
        var result = this._variableResolver(name);
        if (name != result) {
            return result;
        }
        if (typeof this._variables[name] !== 'undefined') {
            return this._variables[name];
        }
        throw new Error('Variable is not defined: ' + name);
    };
    Hippo.prototype.dump = function () {
        return this._variables;
    };
    Hippo.prototype.exec = function (expression) {
        if (typeof expression === 'string') {
            if (this.isVariable(expression)) {
                return this.resolveVariable(expression);
            }
        }
        var stack = new Array();
        for (var _i = 0, expression_1 = expression; _i < expression_1.length; _i++) {
            var fragment = expression_1[_i];
            var resolvedFragment = fragment;
            if (fragment instanceof Array) {
                resolvedFragment = this.exec(fragment);
            }
            if (typeof fragment === 'string') {
                if (this.isMethod(fragment)) {
                    var args = Array.from(stack);
                    stack.splice(0, stack.length);
                    return this.executeMethod(fragment, args);
                }
                if (typeof fragment === 'string') {
                    if (this.isVariable(fragment)) {
                        resolvedFragment = this.exec(fragment);
                    }
                }
            }
            stack.push(resolvedFragment);
        }
    };
    return Hippo;
}());
exports["default"] = Hippo;
//# sourceMappingURL=index.js.map