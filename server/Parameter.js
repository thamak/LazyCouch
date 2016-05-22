"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Parameter = function () {
    function Parameter() {}
    Parameter.prototype.getValue = function (name) {
        return name;
    };
    __decorate([Log(), __metadata('design:type', Function), __metadata('design:paramtypes', [String]), __metadata('design:returntype', void 0)], Parameter.prototype, "getValue", null);
    return Parameter;
}();
exports.Parameter = Parameter;
function Log() {
    return function (targetlol, name, descriptor) {
        console.log("call to " + name);
        return descriptor;
    };
}
//# sourceMappingURL=Parameter.js.map
