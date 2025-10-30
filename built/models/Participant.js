"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var IParticipant_1 = require("../contracts/IParticipant");
var Participant = /** @class */ (function () {
    function Participant() {
        this._isFree = true;
        this._preferences = [];
    }
    Object.defineProperty(Participant.prototype, "isFree", {
        get: function () {
            return this._isFree;
        },
        enumerable: false,
        configurable: true
    });
    Participant.prototype.setOthers = function (others) {
        this._preferences = this.selectPreferences(others);
    };
    Participant.prototype.offer = function (_receivers, run) {
        if (!this._isFree) {
            return;
        }
        if (this._preferences.length === 0) {
            return;
        }
        var preference = this._preferences[0];
        var evaluation = run(this, preference);
        switch (evaluation) {
            case IParticipant_1.Evaluation.Accept:
                this._isFree = false;
                break;
            case IParticipant_1.Evaluation.Reject:
                this._preferences.shift();
                break;
            case IParticipant_1.Evaluation.Hold:
            default:
                break;
        }
    };
    Participant.prototype.evaluate = function (other) {
        var topFree = this._preferences.find(function (preference) { return preference.isFree; });
        if (topFree === other) {
            this._isFree = false;
            return IParticipant_1.Evaluation.Accept;
        }
        if (this._isFree) {
            return IParticipant_1.Evaluation.Hold;
        }
        return IParticipant_1.Evaluation.Reject;
    };
    Participant.prototype.selectPreferences = function (others) {
        // Sort randomly
        var choices = __spreadArray([], others, true);
        var selected = [];
        var _loop_1 = function () {
            var selectionIndex = Math.floor(Math.random() * choices.length);
            var selection = choices[Math.random() * choices.length];
            choices = choices.filter(function (_, i) { return i !== selectionIndex; });
            selected = __spreadArray(__spreadArray([], selected, true), [selection], false);
        };
        while (choices.length > 0) {
            _loop_1();
        }
        return selected;
    };
    return Participant;
}());
exports.default = Participant;
//# sourceMappingURL=Participant.js.map